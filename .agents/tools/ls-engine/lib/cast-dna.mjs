import path from "node:path";
import fs from "node:fs";
import { spawn } from "node:child_process";
import { sha256 } from './fs-utils.mjs';
import {
    quicktype,
    InputData,
    JSONSchemaInput,
    FetchingJSONSchemaStore
} from "quicktype-core";

function parseYaml(yaml) {
    const lines = yaml.split('\n');
    const result = {};
    const stack = [{ indent: -1, obj: result, key: null }];

    for (let line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#')) continue;

        const indent = line.search(/\S/);

        // Handle list items starting with '-'
        if (trimmedLine.startsWith('- ')) {
            const parentEntry = stack[stack.length - 1];
            if (parentEntry.key) {
                const parent = stack[stack.length - 2].obj;
                if (!Array.isArray(parent[parentEntry.key])) {
                    parent[parentEntry.key] = [];
                }
                let valuePart = trimmedLine.slice(2).trim();
                // Strip trailing comment
                let value = valuePart.split(/\s+#/)[0].trim();
                
                if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
                else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
                parent[parentEntry.key].push(value);
            }
            continue;
        }

        const match = trimmedLine.match(/^([^:]+):\s*(.*)$/);
        if (!match) continue;

        const key = match[1].trim();
        let valuePart = match[2].trim();
        
        // Strip trailing comment (YAML standard: space before #)
        let value = valuePart.split(/\s+#/)[0].trim();

        // Handle simple types and JSON-style arrays
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        else if (value.startsWith('[') && value.endsWith(']')) {
            try { value = JSON.parse(value); } catch { /* keep as string if parse fails */ }
        }
        else if (!isNaN(value) && value !== '') value = Number(value);
        else if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        else if (value === '') value = {};

        while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
            stack.pop();
        }

        const parent = stack[stack.length - 1].obj;
        parent[key] = value;

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            stack.push({ indent, obj: value, key });
        }
    }
    return result;
}

export async function castDna(runtime) {
    const root = process.cwd();
    const schemaDir = path.join(root, "assets", "contracts", "schema");
    const outputDir = path.join(root, "assets", "contracts", "generated");

    console.log("Starting Contract Generation (Lò Đúc Brain)...");

    if (!fs.existsSync(schemaDir)) {
        throw new Error(`Schema directory not found: ${schemaDir}`);
    }

    // Ensure output directories exist
    const languages = ["typescript", "dart", "python"];
    languages.forEach(lang => {
        const langDir = lang === "dart"
            ? path.join(outputDir, lang, "lib")
            : path.join(outputDir, lang);
        if (!fs.existsSync(langDir)) {
            fs.mkdirSync(langDir, { recursive: true });
        }
    });
    const schemaFiles = listSchemaFiles(schemaDir);
    const failures = [];
    const generators = {
        typescript: async ({ typeName, resolvedSchemaContent }) => {
            const result = await castModel("typescript", typeName, resolvedSchemaContent);
            return postProcessGeneratedContent("typescript", result.lines.join("\n"));
        },
        dart: async ({ typeName, resolvedSchemaContent }) => {
            const result = await castModel("dart", typeName, resolvedSchemaContent);
            return postProcessGeneratedContent("dart", result.lines.join("\n"));
        },
        python: async ({ resolvedSchemaContent, outputPath, sourceFile, schemaHash, typeName }) => {
            return await runPythonGenerator(resolvedSchemaContent, outputPath, sourceFile, schemaHash, typeName);
        }
    };

    for (const schema of schemaFiles) {
        const schemaPath = schema.absolutePath;
        const typeName = toTypeName(schema.relativePath);
        const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
        const resolvedSchemaContent = resolveLocalRefs(schemaContent, schemaDir, schema.relativePath, root);
        const schemaHash = sha256(schemaContent.replace(/\r\n/g, "\n"));

        console.log(`Processing schema: ${schema.relativePath} -> Type: ${typeName}`);

        for (const lang of languages) {
            try {
                const ext = getExtension(lang);
                const outputRelativePath = getGeneratedRelativePath(schema.relativePath, ext);
                const outputPath = lang === "dart"
                    ? path.join(outputDir, lang, "lib", outputRelativePath)
                    : path.join(outputDir, lang, outputRelativePath);

                const rawContent = await generators[lang]({
                    typeName,
                    resolvedSchemaContent,
                    outputPath,
                    sourceFile: schema.relativePath,
                    schemaHash,
                });
                const finalContent = addHeader(lang, rawContent, schema.relativePath, schemaHash);
                fs.mkdirSync(path.dirname(outputPath), { recursive: true });
                fs.writeFileSync(outputPath, finalContent);
                if (lang === "typescript") {
                    const declarationPath = path.join(outputDir, lang, outputRelativePath.replace(/\.ts$/, ".d.ts"));
                    fs.mkdirSync(path.dirname(declarationPath), { recursive: true });
                    fs.writeFileSync(declarationPath, finalContent);
                }
                console.log(`  [${lang}] Generated: ${path.relative(root, outputPath)}`);
            } catch (e) {
                failures.push(`  [${lang}] Error generating ${schema.relativePath}: ${e.message}`);
                console.error(failures.at(-1));
            }
        }
    }

    if (failures.length > 0) {
        throw new Error(`Contract generation failed:\n${failures.join("\n")}`);
    }

    cleanupLegacyDartRoot(outputDir);
    updateContractMap(root, schemaFiles, outputDir);
    castConfigs(root, outputDir);

    console.log("\nGeneration Complete. Assets are ready in assets/contracts/generated/");
}


function castConfigs(root, outputDir) {
    const configDir = path.join(root, "assets", "configs");
    const genRoot = path.join(root, "assets", "configs", "generated");
    const genTsDir = path.join(genRoot, "typescript");
    const genDartDir = path.join(genRoot, "dart");
    const genDartLibDir = path.join(genDartDir, "lib");
    const genPyDir = path.join(genRoot, "python");

    if (!fs.existsSync(configDir)) return;
    
    // Ensure directories exist
    [genTsDir, genDartDir, genDartLibDir, genPyDir].forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    fs.writeFileSync(path.join(genDartDir, "pubspec.yaml"), [
        `name: letron_configs`,
        `description: Generated Dart configuration package for LETRON LeOS.`,
        `publish_to: none`,
        `environment:`,
        `  sdk: ^3.11.3`,
        ``
    ].join('\n'));

    console.log("\nCasting Business Configurations (Polyglot Forge)...");

    const configFiles = fs.readdirSync(configDir).filter(f => f.endsWith(".yaml") || f.endsWith(".yml"));
    for (const file of configFiles) {
        const filePath = path.join(configDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const configName = path.parse(file).name;
        const constName = configName.toUpperCase().replace(/-/g, '_');
        const typeName = toTypeName(configName);
        
        try {
            const parsed = parseYaml(content);

            const json = JSON.stringify(parsed, null, 2);
            
            // 1. TypeScript (Native Matrix)
            const tsContent = [
                `// [GENERATED] DO NOT EDIT - Stateless Sovereign DNA Matrix`,
                `export const ${constName}_MATRIX = ${json};`,
                ``,
                `export default ${constName}_MATRIX;`
            ].join('\n');
            fs.writeFileSync(path.join(genTsDir, `${configName}.ts`), tsContent);

            const jsContent = [
                `// [GENERATED] DO NOT EDIT - Stateless Sovereign DNA Matrix`,
                `export const ${constName}_MATRIX = ${json};`,
                ``,
                `export default ${constName}_MATRIX;`
            ].join('\n');
            fs.writeFileSync(path.join(genTsDir, `${configName}.js`), jsContent);
            fs.writeFileSync(path.join(genTsDir, `${configName}.json`), json);

            // 2. Dart (Pure Data Class)
            const dartJson = json.replace(/\$/g, () => "\\$");
            const dartContent = [
                `// [GENERATED] DO NOT EDIT - Stateless Sovereign DNA Matrix`,
                ``,
                `class ${typeName}Matrix {`,
                `  static const Map<String, dynamic> data = ${dartJson};`,
                `}`
            ].join('\n');
            fs.writeFileSync(path.join(genDartLibDir, `${configName}.dart`), dartContent);

            // 3. Python (Pure Dictionary)
            const pyJson = json.replaceAll(": true", ": True").replaceAll(": false", ": False").replaceAll(": null", ": None");
            const pyContent = [
                `# [GENERATED] DO NOT EDIT - Stateless Sovereign DNA Matrix`,
                ``,
                `${constName}_MATRIX = ${pyJson}`
            ].join('\n');
            fs.writeFileSync(path.join(genPyDir, `${configName}.py`), pyContent);
            if (configName.includes("-")) {
                fs.writeFileSync(path.join(genPyDir, `${configName.replaceAll("-", "_")}.py`), pyContent);
            }

            console.log(`  [polyglot] Config casted: ${configName} (TS, Dart, Python)`);
        } catch (e) {
            console.error(`  [error] Failed to cast config ${file}: ${e.message}`);
        }
    }
}

function resolveLocalRefs(schemaContent, schemaDir, schemaRelativePath, root) {
    const schema = JSON.parse(schemaContent);
    const currentDir = path.dirname(path.join(schemaDir, schemaRelativePath));
    const seen = new Set([path.join(schemaDir, schemaRelativePath)]);
    return JSON.stringify(resolveNode(schema, currentDir, seen, schema));

    function resolveNode(node, baseDir, stack, documentRoot) {
        if (Array.isArray(node)) {
            return node.map(item => resolveNode(item, baseDir, stack, documentRoot));
        }
        if (!node || typeof node !== "object") return node;

        if (typeof node.$ref === "string" && node.$ref.startsWith("#")) {
            const resolved = resolvePointerRef(node.$ref, baseDir, stack, documentRoot);
            const siblings = { ...node };
            delete siblings.$ref;
            const resolvedSiblings = resolveNode(siblings, baseDir, stack, documentRoot);
            return Object.keys(resolvedSiblings).length === 0
                ? resolved
                : { ...resolved, ...resolvedSiblings };
        }

        if (typeof node.$ref === "string" && isLocalFileRef(node.$ref)) {
            const resolved = resolveFileRef(node.$ref, baseDir, stack);
            const siblings = { ...node };
            delete siblings.$ref;
            const resolvedSiblings = resolveNode(siblings, baseDir, stack, documentRoot);
            return Object.keys(resolvedSiblings).length === 0
                ? resolved
                : { ...resolved, ...resolvedSiblings };
        }

        return Object.fromEntries(
            Object.entries(node).map(([key, value]) => [key, resolveNode(value, baseDir, stack, documentRoot)])
        );
    }

    function isLocalFileRef(ref) {
        return !ref.startsWith("#") && !/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(ref);
    }

    function resolvePointerRef(ref, baseDir, stack, documentRoot) {
        const selected = selectJsonPointer(documentRoot, ref.slice(1));
        return resolveNode(selected, baseDir, stack, documentRoot);
    }

    function resolveFileRef(ref, baseDir, stack) {
        const [refPath, fragment = ""] = ref.split("#");
        const absolutePath = resolveRefPath(refPath, baseDir);
        if (stack.has(absolutePath)) {
            throw new Error(`Circular schema $ref detected: ${ref}`);
        }

        const nextStack = new Set(stack);
        nextStack.add(absolutePath);
        const target = JSON.parse(fs.readFileSync(absolutePath, "utf-8"));
        const selected = fragment ? selectJsonPointer(target, fragment) : target;
        return resolveNode(selected, path.dirname(absolutePath), nextStack, target);
    }

    function resolveRefPath(refPath, baseDir) {
        if (refPath.startsWith("assets/contracts/schema/")) {
            return path.join(root, refPath);
        }
        return path.resolve(baseDir, refPath);
    }

    function selectJsonPointer(rootNode, fragment) {
        if (!fragment || fragment === "/") return rootNode;
        const pointer = fragment.startsWith("/") ? fragment : fragment.replace(/^\//, "");
        return pointer
            .split("/")
            .filter(Boolean)
            .reduce((current, segment) => {
                const key = segment.replace(/~1/g, "/").replace(/~0/g, "~");
                if (current == null || !(key in current)) {
                    throw new Error(`Invalid schema $ref pointer: #${fragment}`);
                }
                return current[key];
            }, rootNode);
    }
}

function listSchemaFiles(schemaDir) {
    const entries = [];
    walk(schemaDir);
    return entries.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

    function walk(dir) {
        fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
            const absolutePath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(absolutePath);
                return;
            }
            if (!entry.isFile() || !entry.name.endsWith(".json")) return;
            entries.push({
                absolutePath,
                relativePath: path.relative(schemaDir, absolutePath).replace(/\\/g, "/")
            });
        });
    }
}

function toTypeName(relativePath) {
    const withoutExt = relativePath.replace(/\.json$/i, "");
    return withoutExt
        .split(/[\\/_-]+/)
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
}

function getGeneratedRelativePath(schemaRelativePath, ext) {
    const parsed = path.posix.parse(schemaRelativePath.replace(/\\/g, "/"));
    return path.posix.join(parsed.dir, `${parsed.name}${ext}`);
}


function cleanupLegacyDartRoot(outputDir) {
    const dartPackageDir = path.join(outputDir, "dart");
    if (!fs.existsSync(dartPackageDir)) return;

    fs.readdirSync(dartPackageDir)
        .filter(file => file.endsWith(".dart"))
        .forEach(file => fs.rmSync(path.join(dartPackageDir, file)));
}

function updateContractMap(root, schemaFiles, outputDir) {
    const mapPath = path.join(root, "assets", "contracts", "contract-map.json");
    let map = { last_updated: "", contracts: {} };

    if (fs.existsSync(mapPath)) {
        try {
            map = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
        } catch (e) {
            console.warn("Could not parse existing contract-map.json, creating new one.");
        }
    }

    map.last_updated = new Date().toISOString();
    map.contracts = {};
    map.apis = {};

    schemaFiles.forEach(schema => {
        const schemaName = schema.relativePath.replace(/\.json$/i, "");
        const tsPath = getGeneratedRelativePath(schema.relativePath, ".ts");
        const dtsPath = getGeneratedRelativePath(schema.relativePath, ".d.ts");
        const dartPath = getGeneratedRelativePath(schema.relativePath, ".dart");
        const pyPath = getGeneratedRelativePath(schema.relativePath, ".py");

        map.contracts[schemaName] = {
            schema: `assets/contracts/schema/${schema.relativePath}`,
            generated: {
                typescript: `assets/contracts/generated/typescript/${tsPath}`,
                typescript_declaration: `assets/contracts/generated/typescript/${dtsPath}`,
                dart: `assets/contracts/generated/dart/lib/${dartPath}`,
                python: `assets/contracts/generated/python/${pyPath}`
            }
        };
    });

    const apiDir = path.join(root, "assets", "contracts", "api");
    if (fs.existsSync(apiDir)) {
        const apiFiles = fs.readdirSync(apiDir).filter(f => f.endsWith(".yaml") || f.endsWith(".yml"));
        apiFiles.forEach(file => {
            const apiName = path.parse(file).name;
            map.apis[apiName] = {
                spec: `assets/contracts/api/${file}`
            };
        });
    }

    const configDir = path.join(root, "assets", "configs");
    if (fs.existsSync(configDir)) {
        map.configs = {};
        const configFiles = fs.readdirSync(configDir).filter(f => f.endsWith(".yaml") || f.endsWith(".yml"));
        configFiles.forEach(file => {
            const configName = path.parse(file).name;
            map.configs[configName] = `assets/configs/${file}`;
        });
    }

    fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));
    console.log(`Updated Contract Map: ${path.relative(root, mapPath)}`);
}

async function runPythonGenerator(resolvedSchemaContent, outputPath, sourceFile, schemaHash, typeName) {
    const tempFile = path.join(path.dirname(outputPath), `${typeName}.resolved.schema.json`);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(tempFile, resolvedSchemaContent, "utf-8");
    try {
        const command = [
            "python",
            "-m",
            "datamodel_code_generator",
            "--input",
            tempFile,
            "--input-file-type",
            "jsonschema",
            "--output",
            outputPath,
            "--output-model-type",
            "pydantic_v2.BaseModel",
            "--target-python-version",
            "3.12",
            "--allof-class-hierarchy",
            "if-no-conflict",
            "--allof-merge-mode",
            "all",
            "--allow-remote-refs",
            "--allow-private-network",
            "--formatters",
            "black",
            "isort",
            "--use-schema-description",
            "--disable-timestamp",
        ];
        await new Promise((resolve, reject) => {
            const proc = spawn(command[0], command.slice(1), { cwd: process.cwd(), stdio: "inherit" });
            proc.on("error", reject);
            proc.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`datamodel-code-generator exited with code ${code}`)));
        });
        const generatedContent = fs.readFileSync(outputPath, "utf-8");
        return generatedContent;
    } finally {
        if (fs.existsSync(tempFile)) fs.rmSync(tempFile, { force: true });
    }
}

async function castModel(targetLanguage, typeName, jsonSchemaString) {
    const schemaInput = new JSONSchemaInput(new FetchingJSONSchemaStore());
    await schemaInput.addSource({ name: typeName, schema: jsonSchemaString });

    const inputData = new InputData();
    inputData.addInput(schemaInput);

    return await quicktype({
        inputData,
        lang: targetLanguage,
        rendererOptions: getRendererOptions(targetLanguage)
    });
}


function getRendererOptions(lang) {
    if (lang === "typescript") {
        return { "just-types": "true", "no-date-times": "true" };
    }
    if (lang === "dart") {
        return { "generate-to-json": "true" };
    }
    return {};
}

function getExtension(lang) {
    switch (lang) {
        case "typescript": return ".ts";
        case "dart": return ".dart";
        case "python": return ".py";
        default: return ".txt";
    }
}

function postProcessGeneratedContent(lang, content) {
    if (lang === "typescript") {
        // Replace Date with string — JSON Schema uses format: date-time
        // which quicktype incorrectly maps to Date instead of string
        return content.replace(/\bDate\b/g, 'string');
    }
    if (lang !== "dart") return content;

    // Split content by "\nclass " to process each class individually
    const segments = content.split(/(?=\nclass\s+)/);
    const processedSegments = segments.map(segment => {
        if (!segment.startsWith("\nclass")) return segment;

        // Parse optional fields in this specific class
        const optionalFields = new Set();
        for (const match of segment.matchAll(/^\s+\w+\?\s+(\w+);\r?$/gm)) {
            optionalFields.add(match[1]);
        }

        // Apply replacements
        return segment
            .replace(
                /(\s+)(\w+): Map\.from\(json\["([^"]+)"\]!\)\.map\(\(k, v\) => MapEntry<String, dynamic>\(k, v\)\),/g,
                '$1$2: json["$3"] == null ? null : Map.from(json["$3"]).map((k, v) => MapEntry<String, dynamic>(k, v)),'
            )
            .replace(
                /(\s+)"([^"]+)": Map\.from\((\w+)!\)\.map\(\(k, v\) => MapEntry<String, dynamic>\(k, v\)\),/g,
                '$1"$2": $3 == null ? null : Map.from($3!).map((k, v) => MapEntry<String, dynamic>(k, v)),'
            )
            .replace(
                /(\s+)(\w+): (\w+Values)\.map\[json\["([^"]+)"\]\]!,/g,
                (match, indent, field, valuesName, jsonKey) => {
                    if (!optionalFields.has(field)) return match;
                    return `${indent}${field}: json["${jsonKey}"] == null ? null : ${valuesName}.map[json["${jsonKey}"]]!,`;
                }
            );
    });

    return processedSegments.join("").replace(/^\s+$/gm, "");
}

function addHeader(lang, content, sourceFile, schemaHash) {
    const isPython = lang === "python";
    const header = isPython 
        ? `# [GENERATED ASSET] DO NOT EDIT MANUALLY\n# Source: assets/contracts/${sourceFile === "contract-map.json" ? "" : "schema/"}${sourceFile}\n# Source Hash: ${schemaHash}\n# Generated by Letron-Leos Sovereign Forge\n# pyright: reportCallIssue=false\n# pyrefly: ignore [invalid-annotation]\n\n`
        : `/**\n * [GENERATED ASSET] DO NOT EDIT MANUALLY\n * Source: assets/contracts/${sourceFile === "contract-map.json" ? "" : "schema/"}${sourceFile}\n * Source Hash: ${schemaHash}\n * Generated by Letron-Leos Sovereign Forge\n */\n\n`;
    return header + content;
}

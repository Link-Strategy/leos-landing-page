import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
};

function createTextNode(value: string): HastNode {
  return { type: "text", value };
}

function createElementNode(
  tagName: string,
  properties: Record<string, unknown> = {},
  children: HastNode[] = [],
): HastNode {
  return {
    type: "element",
    tagName,
    properties,
    children,
  };
}

function transformStandaloneImages(node: HastNode) {
  if (!node.children) {
    return;
  }

  node.children = node.children.map((child) => {
    transformStandaloneImages(child);

    if (child.type !== "element" || child.tagName !== "p" || !child.children) {
      return child;
    }

    const nonEmptyChildren = child.children.filter((grandChild) => {
      return !(grandChild.type === "text" && !(grandChild.value ?? "").trim());
    });

    if (nonEmptyChildren.length !== 1) {
      return child;
    }

    const imageNode = nonEmptyChildren[0];
    if (imageNode?.type !== "element" || imageNode.tagName !== "img") {
      return child;
    }

    const properties = imageNode.properties ?? {};
    const title =
      typeof properties.title === "string" && properties.title.trim()
        ? properties.title.trim()
        : undefined;

    delete properties.title;

    return createElementNode("figure", {}, [
      createElementNode("img", properties),
      ...(title
        ? [createElementNode("figcaption", {}, [createTextNode(title)])]
        : []),
    ]);
  });
}

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "figure", "figcaption"],
};

export async function renderMarkdownToHtml(markdown: string) {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(() => (tree) => {
      transformStandaloneImages(tree as HastNode);
    })
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}

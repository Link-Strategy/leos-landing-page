import { brainOnlyPackageScripts, brainPackageScripts, satellitePackageScripts } from "./constants.mjs";
import { exists, readJson, writeText } from "./fs-utils.mjs";

export function mergeBrainPackageContract(packagePath, defaults = {}) {
  const current = exists(packagePath) ? readJson(packagePath) : {};
  const next = {
    ...current,
    ...defaults,
    private: current.private ?? true,
    type: "module",
    engines: {
      ...(current.engines || {}),
      node: current.engines?.node || ">=20"
    },
    scripts: {
      ...(current.scripts || {}),
      ...brainPackageScripts
    }
  };
  writeText(packagePath, `${JSON.stringify(next, null, 2)}\n`);
}

export function mergePackageContract(packagePath, defaults = {}) {
  const current = exists(packagePath) ? readJson(packagePath) : {};
  const next = {
    ...current,
    ...defaults,
    private: current.private ?? true,
    type: "module",
    engines: {
      ...(current.engines || {}),
      node: current.engines?.node || ">=20"
    },
    dependencies: {
      ...(current.dependencies || {}),
      ...(defaults.dependencies || {})
    },
    devDependencies: {
      ...(current.devDependencies || {}),
      ...(defaults.devDependencies || {})
    },
    scripts: sanitizeSatelliteScripts(current.scripts || {}, defaults.scripts || {})
  };
  writeText(packagePath, `${JSON.stringify(next, null, 2)}\n`);
}

export function sanitizeSatelliteScripts(current, monolith = {}) {
  const next = { ...current, ...monolith };
  for (const name of brainOnlyPackageScripts) delete next[name];
  return {
    ...next,
    ...satellitePackageScripts
  };
}

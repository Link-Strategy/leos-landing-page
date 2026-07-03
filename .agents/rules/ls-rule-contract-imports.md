---
trigger: always_on
description: "Portable generated DNA consumption discipline for Hands workspaces."
---
# LS-RULE-GENERATED-DNA-IMPORTS

Hands code must stay portable between Satellite and Brain harvest paths, regardless of framework or language runtime.

## What Hands Must Do

Hands must consume generated contracts and configs through the adapters that Brain has already provided for the current workspace.

1. Check the workspace config for explicit generated DNA adapters:
   - TypeScript: `tsconfig.json` path alias or package dependency.
   - Python: `pyproject.toml`, `requirements.txt`, or package/module docs provided by Brain.
   - Dart/Flutter: `pubspec.yaml` or package docs provided by Brain.
   - Other runtimes: adapter documented by Brain in the workspace.
2. Use only that adapter in application code.
3. If the adapter is compile-time/type-only, use it only for types.
4. If runtime values such as enums/constants are needed, use a Brain-owned runtime adapter/package.
5. If the required adapter is missing, stop and record a blocker in `02_DECISION_LOGS.md`.

The current generated assets live under `assets/contracts/generated/` and `assets/configs/generated/`, but those locations are DNA storage, not application import boundaries.

An adapter is valid only when it exists in workspace governance or dependency config. Names below are patterns unless the exact adapter name is present in the workspace.

## Examples

TypeScript, when Brain provides the current adapters:

```ts
import type { Identity } from "@contracts/identity";
import infraConfig from "@configs/infrastructure-config";
```

Python, only when Brain provides a Python package adapter in workspace config:

```text
from BRAIN_PROVIDED_CONTRACT_PACKAGE.identity import Identity
```

Dart/Flutter, when Brain provides the `letron_contracts` package adapter through
`pubspec.yaml`:

```text
import 'package:letron_contracts/identity.dart';
import 'package:letron_configs/infrastructure-config.dart';
```

> **Note on Flutter Dependencies:** `pubspec.yaml` in Satellite workspaces is configured with flat relative paths (e.g., `assets/contracts/generated/dart`) by default, so it works natively. In the Monolith, a local `pubspec_overrides.yaml` is used to redirect paths to the Monolith root, which must not be modified or pushed to the Satellite repository.

Runtime enum/constants imports are not available unless Brain provides a runtime adapter/package in the workspace dependency config. Until then, record a blocker instead of inventing an import.

The exact adapter name may differ by framework. The rule is: use the Brain-provided adapter, not the physical generated file path.

## Forbidden

Do not import generated contracts through relative paths.

TypeScript:

```ts
import type { Identity } from "../assets/contracts/generated/typescript/identity";
import infraConfig from "../assets/configs/generated/typescript/infrastructure-config";
import infraConfig from "@contracts/configs/infrastructure-config";
```

Python:

```python
from assets.contracts.generated.python.identity import Identity
from ..assets.contracts.generated.python.identity import Identity
```

Dart/Flutter:

```dart
import '../assets/contracts/generated/dart/identity.dart';
import '../assets/configs/generated/dart/infrastructure-config.dart';
import 'assets/contracts/generated/dart/identity.dart';
import 'package:letron_contracts/configs/infrastructure-config.dart';
```

Do not use runtime-specific alias mechanisms unless Brain has explicitly provided that adapter for the workspace. These mechanisms can resolve differently between Satellite and Brain package roots.

Do not copy generated contract or config files into `src/` to make imports easier.

Do not hardcode enum/string/config values when the generated DNA adapter is missing. Record a blocker instead.

---
**Status:** ACTIVE PORTABILITY RULE  
**Priority:** LEVEL 1

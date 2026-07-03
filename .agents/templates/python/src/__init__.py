"""Python Satellite Service source package."""

import sys
from pathlib import Path

# --- Dual-Route Asset Path Resolution for Python Runtime ---
_resolved_paths = []

# Route 1: Local Hand assets (Standalone Satellite Mode)
try:
    _local_contracts = Path(__file__).resolve().parent.parent / "assets" / "contracts" / "generated" / "python"
    _local_configs = Path(__file__).resolve().parent.parent / "assets" / "configs" / "generated" / "python"
    _resolved_paths.extend([_local_contracts, _local_configs])
except IndexError:
    pass

# Route 2: Monolith Root assets (Integrated Brain Dev Mode)
try:
    _root_contracts = Path(__file__).resolve().parent.parent.parent.parent / "assets" / "contracts" / "generated" / "python"
    _root_configs = Path(__file__).resolve().parent.parent.parent.parent / "assets" / "configs" / "generated" / "python"
    _resolved_paths.extend([_root_contracts, _root_configs])
except IndexError:
    pass

for path in _resolved_paths:
    if path.exists() and str(path) not in sys.path:
        sys.path.insert(0, str(path))

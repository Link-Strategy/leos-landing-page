import json
from pathlib import Path

from jsonschema import Draft202012Validator, RefResolver


# Dual-route contracts path resolution for test suite
def get_contracts_path() -> Path:
    # Route 1: Local Hand assets path
    try:
        local_path = Path(__file__).resolve().parents[2] / "assets" / "contracts"
        if local_path.exists():
            return local_path
    except IndexError:
        pass
        
    # Route 2: Monolith Root assets path
    try:
        root_path = Path(__file__).resolve().parents[4] / "assets" / "contracts"
        if root_path.exists():
            return root_path
    except IndexError:
        pass
        
    raise FileNotFoundError("Contracts directory not found under local or root path.")
    
CONTRACTS = get_contracts_path()


def _load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def rewrite_refs(obj, file_path: Path, base_dir: Path, canonical_id: str):
    if isinstance(obj, dict):
        if "$ref" in obj and isinstance(obj["$ref"], str):
            ref = obj["$ref"]
            if ref.startswith("#"):
                obj["$ref"] = f"{canonical_id}{ref}"
            elif not ref.startswith("http://") and not ref.startswith("https://"):
                parts = ref.split("#", 1)
                rel_path = parts[0]
                fragment = f"#{parts[1]}" if len(parts) > 1 else ""
                resolved_path = (file_path.parent / rel_path).resolve()
                schema_rel = resolved_path.relative_to(base_dir).as_posix()
                obj["$ref"] = f"https://leos.local/contracts/schemas/aria/{schema_rel}{fragment}"
        for k, v in obj.items():
            rewrite_refs(v, file_path, base_dir, canonical_id)
    elif isinstance(obj, list):
        for item in obj:
            rewrite_refs(item, file_path, base_dir, canonical_id)


def _validate(instance, schema_path: Path) -> None:
    # Pre-populate schema store with all local schemas, rewriting relative refs
    schema_store = {}
    schemas_to_register = []
    base_dir = (CONTRACTS / "schema" / "aria").resolve()

    for p in base_dir.rglob("*.json"):
        content = json.loads(p.read_text(encoding="utf-8"))
        rel_path = p.relative_to(base_dir).as_posix()
        canonical_id = content.get("$id", f"https://leos.local/contracts/schemas/aria/{rel_path}")
        rewrite_refs(content, p, base_dir, canonical_id)
        schemas_to_register.append((p, content, canonical_id))

    for p, content, canonical_id in schemas_to_register:
        schema_store[p.resolve().as_uri()] = content
        schema_store[canonical_id] = content

    schema = schema_store[schema_path.resolve().as_uri()]
    resolver = RefResolver(base_uri=schema_path.resolve().as_uri(), referrer=schema, store=schema_store)
    errors = sorted(Draft202012Validator(schema, resolver=resolver).iter_errors(instance), key=lambda err: list(err.path))
    assert not errors, "; ".join(f"{'/'.join(map(str, err.path)) or '$'}: {err.message}" for err in errors)


def test_observer_snapshot_example_matches_schema() -> None:
    snapshot_payload = _load_json(CONTRACTS / "examples" / "aria" / "observer-snapshot.full.json")
    _validate(snapshot_payload, CONTRACTS / "schema" / "aria" / "observer-snapshot.json")


def test_observer_frame_example_matches_schema() -> None:
    frame_payload = _load_json(CONTRACTS / "examples" / "aria" / "observer-frame.patch.json")
    _validate(frame_payload, CONTRACTS / "schema" / "aria" / "observer-frame.json")


def test_observer_heartbeat_example_matches_schema() -> None:
    heartbeat_payload = _load_json(CONTRACTS / "examples" / "aria" / "observer-heartbeat.ok.json")
    _validate(heartbeat_payload, CONTRACTS / "schema" / "aria" / "observer-heartbeat.json")


def test_live_envelope_example_matches_schema() -> None:
    live_envelope_payload = _load_json(CONTRACTS / "examples" / "aria" / "live-envelope.batch.vehicle-telemetry.json")
    _validate(live_envelope_payload, CONTRACTS / "schema" / "aria" / "live-envelope.json")

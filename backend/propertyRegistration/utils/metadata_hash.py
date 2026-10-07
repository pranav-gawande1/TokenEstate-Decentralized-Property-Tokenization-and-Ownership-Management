import hashlib
import json
from decimal import Decimal
from typing import Any


def _normalize(value: Any) -> Any:
    if isinstance(value, Decimal):
        return format(value, "f")
    if isinstance(value, dict):
        return {str(k): _normalize(v) for k, v in sorted(value.items(), key=lambda item: str(item[0]))}
    if isinstance(value, (list, tuple)):
        return [_normalize(v) for v in value]
    return value


def canonicalize_metadata(metadata: dict[str, Any]) -> str:
    normalized = _normalize(metadata)
    return json.dumps(normalized, ensure_ascii=False, separators=(",", ":"), sort_keys=True)


def metadata_sha256(metadata: dict[str, Any]) -> str:
    canonical = canonicalize_metadata(metadata)
    digest = hashlib.sha256(canonical.encode("utf-8")).hexdigest()
    return f"0x{digest}"

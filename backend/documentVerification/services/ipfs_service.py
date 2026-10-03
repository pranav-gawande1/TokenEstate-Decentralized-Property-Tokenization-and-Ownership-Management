import os
import json
import hashlib
from typing import Optional

import requests
from dotenv import load_dotenv

load_dotenv()

PINATA_API = "https://api.pinata.cloud"
TIMEOUT = 60


def _jwt() -> str:
    return os.getenv("PINATA_JWT", "").strip()


def _headers() -> dict:
    return {"Authorization": f"Bearer {_jwt()}"}


def is_mock_cid(cid: Optional[str]) -> bool:
    """Mock CIDs must NEVER be written to the blockchain."""
    return bool(cid) and cid.startswith("mock-")


def build_gateway_url(cid: str) -> str:
    """Works whether PINATA_GATEWAY_URL is 'https://x.mypinata.cloud',
    'https://x.mypinata.cloud/ipfs/' or 'https://gateway.pinata.cloud/ipfs/'."""
    base = os.getenv("PINATA_GATEWAY_URL", "https://gateway.pinata.cloud").strip().rstrip("/")
    if base.endswith("/ipfs"):
        base = base[: -len("/ipfs")]
    return f"{base}/ipfs/{cid}"


def test_pinata_auth() -> bool:
    """True if the JWT is valid. Call once at startup or from /engine-status."""
    if not _jwt():
        return False
    try:
        r = requests.get(f"{PINATA_API}/data/testAuthentication", headers=_headers(), timeout=15)
        return r.status_code == 200
    except requests.RequestException:
        return False


def upload_to_pinata(file_bytes: bytes, filename: str, metadata: Optional[dict] = None) -> str:
    """
    Pins a file to IPFS through Pinata and returns the CID.

    metadata -> searchable labels stored in YOUR Pinata account (not on the public IPFS network),
    e.g. {"propertyId": 101, "docType": "DEED", "keccak256": "0x..."}.
    Pinata allows at most 10 keys. Do NOT put names or other personal data here.
    """
    if not _jwt():
        # Local testing only: unique per file, clearly fake, rejected by is_mock_cid()
        return "mock-" + hashlib.sha256(file_bytes).hexdigest()[:46]

    pinata_metadata = {"name": filename}
    if metadata:
        pinata_metadata["keyvalues"] = {k: str(v) for k, v in list(metadata.items())[:10]}
    pinata_options = {"cidVersion": 1}

    response = requests.post(
        f"{PINATA_API}/pinning/pinFileToIPFS",
        headers=_headers(),
        files={"file": (filename, file_bytes, "application/pdf")},
        data={
            "pinataMetadata": json.dumps(pinata_metadata),
            "pinataOptions": json.dumps(pinata_options),
        },
        timeout=TIMEOUT,
    )
    response.raise_for_status()
    return response.json()["IpfsHash"]


def upload_json_to_pinata(content: dict, name: str) -> str:
    """Pins a small JSON record (e.g. document info) and returns its CID."""
    if not _jwt():
        raw = json.dumps(content, sort_keys=True).encode()
        return "mock-" + hashlib.sha256(raw).hexdigest()[:46]

    response = requests.post(
        f"{PINATA_API}/pinning/pinJSONToIPFS",
        headers={**_headers(), "Content-Type": "application/json"},
        json={
            "pinataContent": content,
            "pinataMetadata": {"name": name},
            "pinataOptions": {"cidVersion": 1},
        },
        timeout=TIMEOUT,
    )
    response.raise_for_status()
    return response.json()["IpfsHash"]
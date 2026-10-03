import re
import hashlib
from web3 import Web3


def compute_keccak256(data: bytes) -> str:
    """0x-prefixed 32-byte hash, same as Solidity keccak256(data).
    Web3.to_hex always adds '0x' (the old '.hex()' differs between web3 v6 and v7)."""
    return Web3.to_hex(Web3.keccak(data))


def compute_sha256(data: bytes) -> str:
    """Normal SHA-256 checksum (no 0x prefix)."""
    return hashlib.sha256(data).hexdigest()


def compute_content_keccak256(text: str) -> str:
    """Fingerprint of the document TEXT: lowercase, letters+digits only."""
    normalized = re.sub(r"[^a-z0-9]", "", (text or "").lower())
    return Web3.to_hex(Web3.keccak(normalized.encode("utf-8")))
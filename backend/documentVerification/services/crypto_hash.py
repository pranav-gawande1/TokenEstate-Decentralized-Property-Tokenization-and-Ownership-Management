import hashlib
import re
from web3 import Web3

def compute_sha256(file_bytes: bytes) -> str:
    """Deterministic SHA-256 hash of the raw PDF file bytes."""
    return hashlib.sha256(file_bytes).hexdigest()

def compute_keccak256(file_bytes: bytes) -> str:
    """Deterministic Web3 Keccak-256 hash (bytes32) of the raw PDF file bytes."""
    return "0x" + Web3.keccak(file_bytes).hex()

def compute_content_keccak256(extracted_text: str) -> str:
    """
    Canonical Content Hash: Normalizes all extracted text (lowercase, alphanumeric only)
    so that even if a PDF is re-saved or scanned, the legal text fingerprint stays identical.
    """
    normalized = re.sub(r"[^a-z0-9]", "", extracted_text.lower())
    return "0x" + Web3.keccak(text=normalized).hex()
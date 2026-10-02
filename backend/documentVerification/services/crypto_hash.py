import hashlib
from web3 import Web3

def compute_sha256(file_bytes: bytes) -> str:
    """Standard SHA-256 hash for IPFS / client verification."""
    return hashlib.sha256(file_bytes).hexdigest()

def compute_keccak256(file_bytes: bytes) -> str:
    """Web3 Keccak-256 hash for Solidity bytes32 smart contract matching."""
    return "0x" + Web3.keccak(file_bytes).hex()
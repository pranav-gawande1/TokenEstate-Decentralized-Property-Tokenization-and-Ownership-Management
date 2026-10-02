import os
import requests
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()
PINATA_JWT = os.getenv("PINATA_JWT")

def compute_keccak256(file_bytes: bytes) -> str:
    # Returns 0x-prefixed 32-byte hex hash directly compatible with Solidity bytes32
    return "0x" + Web3.keccak(file_bytes).hex()

def upload_to_pinata(file_bytes: bytes, filename: str) -> str:
    if not PINATA_JWT:
        # Fallback mock CID so you can test locally before adding your Pinata key
        return "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"

    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    headers = {"Authorization": f"Bearer {PINATA_JWT}"}
    files = {"file": (filename, file_bytes)}
    
    response = requests.post(url, files=files, headers=headers)
    response.raise_for_status()
    return response.json()["IpfsHash"]
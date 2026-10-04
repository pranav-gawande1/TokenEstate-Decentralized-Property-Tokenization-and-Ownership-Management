from enum import Enum
from typing import List, Dict, Any

class Role(str, Enum):
    ADMIN = "admin"
    REGISTRAR = "registrar"
    OWNER = "owner"
    BUYER = "buyer"
    VERIFIER = "verifier"
    OFFICER = "officer"
    AUDITOR = "auditor"

ROLE_METADATA: Dict[str, Dict[str, str]] = {
    Role.ADMIN.value: {
        "title": "System Administrator",
        "description": "Full access to user management, smart contract parameters, and emergency overrides.",
    },
    Role.REGISTRAR.value: {
        "title": "Government Registrar",
        "description": "Authorized to approve land transfers, mint property NFTs, and manage deeds.",
    },
    Role.OWNER.value: {
        "title": "Property Owner",
        "description": "Can list real estate properties, initiate sales, and transfer land tokens.",
    },
    Role.BUYER.value: {
        "title": "Property Buyer / Investor",
        "description": "Can browse properties, fund escrow, and purchase fractional land tokens.",
    },
    Role.VERIFIER.value: {
        "title": "Document Verifier",
        "description": "Verifies deed authenticity, cryptographic hashes, and IPFS forensics.",
    },
    Role.OFFICER.value: {
        "title": "Cadastral Officer",
        "description": "Conducts survey validation, title checks, and legal document reviews.",
    },
    Role.AUDITOR.value: {
        "title": "Third-Party Auditor",
        "description": "Read-only access to transaction logs, smart contract states, and compliance reports.",
    },
}

def get_available_roles() -> List[Dict[str, Any]]:
    """Returns formatted list of roles for front-end dropdown selection."""
    return [
        {
            "role": r.value,
            "title": ROLE_METADATA.get(r.value, {}).get("title", r.value.title()),
            "description": ROLE_METADATA.get(r.value, {}).get("description", ""),
        }
        for r in Role
    ]

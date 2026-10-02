from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class FraudReport(BaseModel):
    is_authentic: bool
    risk_score: int
    verdict: str
    flags: List[str]
    layer_results: Dict[str, Any]

class VerificationResponse(BaseModel):
    status: str
    property_id: int
    doc_type: str
    keccak256_hash: str
    sha256_hash: str
    ipfs_cid: Optional[str] = None
    fraud_report: FraudReport

class TamperCheckResponse(BaseModel):
    is_match: bool
    calculated_hash: str
    onchain_hash: str
    verdict: str
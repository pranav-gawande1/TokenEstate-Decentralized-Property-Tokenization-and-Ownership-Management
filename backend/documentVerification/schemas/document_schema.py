from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class FraudReport(BaseModel):
    is_authentic: bool
    risk_score: int = Field(..., description="Cumulative fraud score from 0 (clean) to 100 (high fraud risk)")
    verdict: str = Field(..., description="AUTHENTIC or FRAUD_DETECTED")
    flags: List[str] = Field(default_factory=list, description="List of forensic anomalies triggered")
    layer_results: Dict[str, Any] = Field(..., description="Detailed breakdown of all 4 forensic layers")

class VerificationResponse(BaseModel):
    status: str = Field(..., description="PASSED_VERIFIED or REJECTED_FRAUD_DETECTED")
    property_id: int
    doc_type: str
    keccak256_hash: str = Field(..., description="0x-prefixed bytes32 hash of the raw PDF binary bytes")
    content_keccak256_hash: str = Field(..., description="0x-prefixed bytes32 hash of normalized OCR/digital text")
    sha256_hash: str = Field(..., description="Standard SHA-256 file checksum")
    ipfs_cid: Optional[str] = Field(None, description="Pinata IPFS Content Identifier (null if rejected)")
    fraud_report: FraudReport

class TamperCheckResponse(BaseModel):
    is_binary_match: bool = Field(..., description="True if raw file bytes & metadata are 100% identical")
    is_content_match: Optional[bool] = Field(None, description="True if normalized text matches on-chain content hash")
    calculated_binary_hash: str
    calculated_content_hash: str
    onchain_hash: str
    verdict: str
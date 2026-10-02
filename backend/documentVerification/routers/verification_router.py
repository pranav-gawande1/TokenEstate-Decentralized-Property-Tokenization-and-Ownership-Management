from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from documentVerification.schemas.document_schema import VerificationResponse, TamperCheckResponse
from documentVerification.services.fraud_detector import analyze_document_fraud
from documentVerification.services.crypto_hash import compute_keccak256, compute_sha256
from documentVerification.services.ipfs_service import upload_to_pinata

router = APIRouter(prefix="/documents", tags=["Document Verification"])

@router.post("/verify-and-hash", response_model=VerificationResponse)
async def verify_and_hash_document(
    property_id: int = Form(...),
    doc_type: str = Form(..., description="DEED, TAX_RECEIPT, SURVEY, etc."),
    survey_number: str = Form(None),
    owner_name: str = Form(None),
    file: UploadFile = File(...)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF real estate documents are accepted."
        )

    file_bytes = await file.read()

    # 1. Execute the 3-Layer Forensic & Fraud Analysis
    fraud_report = analyze_document_fraud(
        file_bytes=file_bytes,
        expected_survey_no=survey_number,
        expected_owner=owner_name
    )

    # 2. Compute Cryptographic Hashes
    doc_keccak = compute_keccak256(file_bytes)
    doc_sha = compute_sha256(file_bytes)

    # 3. Block upload if Fraud detected
    if not fraud_report["is_authentic"]:
        return VerificationResponse(
            status="REJECTED_FRAUD_DETECTED",
            property_id=property_id,
            doc_type=doc_type,
            keccak256_hash=doc_keccak,
            sha256_hash=doc_sha,
            ipfs_cid=None,
            fraud_report=fraud_report
        )

    # 4. Upload to IPFS only if all 3 layers pass
    ipfs_cid = upload_to_pinata(file_bytes, file.filename)

    return VerificationResponse(
        status="PASSED_VERIFIED",
        property_id=property_id,
        doc_type=doc_type,
        keccak256_hash=doc_keccak,
        sha256_hash=doc_sha,
        ipfs_cid=ipfs_cid,
        fraud_report=fraud_report
    )

@router.post("/tamper-check", response_model=TamperCheckResponse)
async def verify_tamper_status(
    onchain_hash: str = Form(...),
    file: UploadFile = File(...)
):
    """Allows anyone to upload a file and compare its live Keccak-256 hash against Polygon."""
    file_bytes = await file.read()
    calculated_hash = compute_keccak256(file_bytes)
    is_match = calculated_hash.lower() == onchain_hash.strip().lower()

    return TamperCheckResponse(
        is_match=is_match,
        calculated_hash=calculated_hash,
        onchain_hash=onchain_hash,
        verdict="100% Authentic & Unaltered" if is_match else "TAMPERED: Cryptographic Hash Mismatch!"
    )
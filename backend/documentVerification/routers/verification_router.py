import io
import os
from typing import Optional

import pymupdf
from PIL import Image
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status

from documentVerification.schemas.document_schema import (
    VerificationResponse,
    TamperCheckResponse,
    FraudReport
)
from documentVerification.services.fraud_detector import (
    analyze_document_fraud,
    extract_text_with_ocr_fallback
)
from documentVerification.services.crypto_hash import (
    compute_keccak256,
    compute_sha256,
    compute_content_keccak256
)
from documentVerification.services.ipfs_service import upload_to_pinata

router = APIRouter(prefix="/documents", tags=["Document Verification & Forensics"])


@router.get("/engine-status")
def get_engine_status():
    """Diagnostic endpoint to verify loaded AI models and external gateways."""
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    pinata_jwt = os.getenv("PINATA_JWT", "").strip()

    return {
        "status": "operational",
        "forensic_layers": {
            "layer_1_metadata": "PyMuPDF Header & Timestamp Inspector",
            "layer_2_pixel_ela": "Pillow + NumPy Error Level Analysis (90% JPEG Resave)",
            "layer_3a_local_vision": "openai/clip-vit-base-patch32 (Zero-Shot Vision)",
            "layer_3b_deep_vision": "gemini-2.5-flash" if gemini_key.startswith("AIza") else "Disabled (No valid GEMINI_API_KEY)",
            "layer_4_ocr_engine": "Hybrid PyMuPDF Digital Stream + RapidOCR (ONNX)"
        },
        "ipfs_gateway": "Pinata Cloud Connected" if pinata_jwt else "Local Deterministic Mock CID Fallback"
    }


@router.post("/verify-and-hash", response_model=VerificationResponse)
async def verify_and_hash_document(
    property_id: int = Form(..., description="On-chain Property ID from Property Registration module"),
    doc_type: str = Form("DEED", description="Document category: DEED, TAX_RECEIPT, SURVEY, ENCUMBRANCE"),
    survey_number: Optional[str] = Form(None, description="Expected Survey Number to cross-verify via OCR"),
    owner_name: Optional[str] = Form(None, description="Expected Owner Name to cross-verify via OCR"),
    file: UploadFile = File(..., description="PDF property document to inspect and anchor")
):
    """
    Executes the 4-Layer AI & Forensic Pipeline, computes Dual Keccak-256 Hashes
    (Raw Binary + Normalized Content), and pins authentic documents to IPFS.
    """
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF real estate documents are accepted."
        )

    file_bytes = await file.read()
    if len(file_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded PDF file is empty."
        )

    # 1. Run 4-Layer Forensic & AI Inspection
    fraud_data = analyze_document_fraud(
        file_bytes=file_bytes,
        expected_survey_no=survey_number,
        expected_owner=owner_name
    )

    # 2. Compute Cryptographic Hashes (Raw Binary + Normalized Content + SHA-256)
    raw_keccak = compute_keccak256(file_bytes)
    content_keccak = compute_content_keccak256(fraud_data.get("extracted_text", ""))
    doc_sha256 = compute_sha256(file_bytes)

    fraud_report_obj = FraudReport(
        is_authentic=fraud_data["is_authentic"],
        risk_score=fraud_data["risk_score"],
        verdict=fraud_data["verdict"],
        flags=fraud_data["flags"],
        layer_results=fraud_data["layer_results"]
    )

    # 3. Gatekeeper Check: Block IPFS Pinning if Fraud Risk Score >= 40
    if not fraud_data["is_authentic"]:
        return VerificationResponse(
            status="REJECTED_FRAUD_DETECTED",
            property_id=property_id,
            doc_type=doc_type,
            keccak256_hash=raw_keccak,
            content_keccak256_hash=content_keccak,
            sha256_hash=doc_sha256,
            ipfs_cid=None,
            fraud_report=fraud_report_obj
        )

    # 4. Pin Validated Document to IPFS
    ipfs_cid = upload_to_pinata(file_bytes, file.filename)

    return VerificationResponse(
        status="PASSED_VERIFIED",
        property_id=property_id,
        doc_type=doc_type,
        keccak256_hash=raw_keccak,
        content_keccak256_hash=content_keccak,
        sha256_hash=doc_sha256,
        ipfs_cid=ipfs_cid,
        fraud_report=fraud_report_obj
    )


@router.post("/tamper-check", response_model=TamperCheckResponse)
async def verify_tamper_status(
    onchain_hash: str = Form(..., description="0x-prefixed Keccak-256 hash stored on Polygon"),
    file: UploadFile = File(..., description="PDF file to verify against the on-chain record")
):
    """
    Zero-Trust Public Tamper Checker:
    Compares an uploaded PDF against an on-chain hash using BOTH Raw Binary Hashing
    and OCR Content Hashing to distinguish between metadata edits and content tampering.
    """
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported for tamper verification."
        )

    file_bytes = await file.read()
    clean_onchain_hash = onchain_hash.strip().lower()

    # 1. Compute Raw Binary Keccak-256 Hash
    calc_binary_hash = compute_keccak256(file_bytes)

    # 2. Extract Text (Digital + RapidOCR) and Compute Canonical Content Hash
    doc = pymupdf.open(stream=file_bytes, filetype="pdf")
    first_page_pix = doc[0].get_pixmap(dpi=150)
    first_page_img = Image.open(io.BytesIO(first_page_pix.tobytes("jpeg"))).convert("RGB")
    ocr_data = extract_text_with_ocr_fallback(doc, first_page_img)
    calc_content_hash = compute_content_keccak256(ocr_data["combined_text"])

    is_binary_match = calc_binary_hash.lower() == clean_onchain_hash
    is_content_match = calc_content_hash.lower() == clean_onchain_hash

    if is_binary_match:
        verdict = "100% AUTHENTIC: Exact Binary & Cryptographic Match with On-Chain Record."
    elif is_content_match:
        verdict = "CONTENT MATCH ONLY: Legal text is identical, but file metadata/compression was modified."
    else:
        verdict = "TAMPERED / MISMATCH: Document bytes and legal content do not match the Polygon record!"

    return TamperCheckResponse(
        is_binary_match=is_binary_match,
        is_content_match=is_content_match,
        calculated_binary_hash=calc_binary_hash,
        calculated_content_hash=calc_content_hash,
        onchain_hash=onchain_hash.strip(),
        verdict=verdict
    )
import io
import pymupdf
import numpy as np
from PIL import Image, ImageChops

SUSPICIOUS_PRODUCERS = ["photoshop", "canva", "ilovepdf", "sejda", "gimp", "illustrator", "foxit", "smallpdf"]

def analyze_document_fraud(file_bytes: bytes, expected_survey_no: str = None, expected_owner: str = None) -> dict:
    flags = []
    risk_score = 0
    layer_results = {}

    doc = pymupdf.open(stream=file_bytes, filetype="pdf")
    metadata = doc.metadata

    # --- LAYER 1: METADATA & FORGERY SIGNATURE INSPECTION ---
    producer = (metadata.get("producer") or "").lower()
    creator = (metadata.get("creator") or "").lower()
    creation_date = metadata.get("creationDate")
    mod_date = metadata.get("modDate")

    software_detected = [tool for tool in SUSPICIOUS_PRODUCERS if tool in producer or tool in creator]
    
    if software_detected:
        risk_score += 45
        flags.append(f"Edited with known software: {', '.join(software_detected).upper()}")

    if creation_date and mod_date and (creation_date != mod_date):
        risk_score += 15
        flags.append("Document modified after initial creation timestamp")

    layer_results["layer_1_metadata"] = {
        "passed": len(software_detected) == 0,
        "creator": metadata.get("creator"),
        "producer": metadata.get("producer"),
        "tamper_detected": len(software_detected) > 0
    }

    # --- LAYER 2: ERROR LEVEL ANALYSIS (PIXEL INTEGRITY) ---
    first_page = doc[0]
    pix = first_page.get_pixmap(dpi=150)
    orig_img = Image.open(io.BytesIO(pix.tobytes("jpeg"))).convert("RGB")

    buffer = io.BytesIO()
    orig_img.save(buffer, "JPEG", quality=90)
    buffer.seek(0)
    resaved_img = Image.open(buffer)

    ela_img = ImageChops.difference(orig_img, resaved_img)
    ela_np = np.array(ela_img)
    anomaly_ratio = float(np.mean(ela_np > 35))

    ela_passed = anomaly_ratio <= 0.015
    if not ela_passed:
        risk_score += 40
        flags.append(f"Visual compression anomaly detected ({anomaly_ratio:.4f})")

    layer_results["layer_2_pixel_ela"] = {
        "passed": ela_passed,
        "anomaly_score": round(anomaly_ratio, 4)
    }

    # --- LAYER 3: OCR / TEXT LAYER CONSISTENCY CHECK ---
    extracted_text = "".join([page.get_text() for page in doc])

    survey_match = True
    if expected_survey_no:
        survey_match = expected_survey_no.lower() in extracted_text.lower()
        if not survey_match:
            risk_score += 35
            flags.append(f"Expected Survey Number '{expected_survey_no}' missing from document")

    owner_match = True
    if expected_owner:
        owner_match = expected_owner.lower() in extracted_text.lower()
        if not owner_match:
            risk_score += 25
            flags.append(f"Expected Owner '{expected_owner}' missing from document")

    layer_results["layer_3_content_check"] = {
        "passed": survey_match and owner_match,
        "survey_match": survey_match,
        "owner_match": owner_match
    }

    total_risk = min(risk_score, 100)
    is_authentic = total_risk < 40

    return {
        "is_authentic": is_authentic,
        "risk_score": total_risk,
        "verdict": "AUTHENTIC" if is_authentic else "FRAUD_DETECTED",
        "flags": flags,
        "layer_results": layer_results
    }
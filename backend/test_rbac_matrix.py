import io
from fastapi.testclient import TestClient
from main import app
from authentication.services.jwt_handler import create_access_token

def test_rbac_permissions():
    with TestClient(app) as client:
        print("================================================================")
        print("   TokenEstate Role-Based Access Control (RBAC) Matrix Test     ")
        print("================================================================")

        # Generate tokens matching seeded database users:
        # 1: admin, 2: officer, 3: registrar, 4: owner, 5: buyer, 6: auditor
        admin_token = create_access_token({"sub": "admin@tokenestate.io", "user_id": 1, "role": "admin"})
        officer_token = create_access_token({"sub": "officer@tokenestate.io", "user_id": 2, "role": "officer"})
        registrar_token = create_access_token({"sub": "registrar@tokenestate.io", "user_id": 3, "role": "registrar"})
        owner_token = create_access_token({"sub": "owner@tokenestate.io", "user_id": 4, "role": "owner"})
        buyer_token = create_access_token({"sub": "buyer@tokenestate.io", "user_id": 5, "role": "buyer"})

        fake_pdf = io.BytesIO(b"%PDF-1.4 minimal test pdf content")

        # -------------------------------------------------------------
        # 1. VERIFICATION MODULE TEST (/documents/verify-and-hash)
        # -------------------------------------------------------------
        print("\n--- Testing Verification Module Permissions ---")

        # Buyer -> MUST BE 403
        fake_pdf.seek(0)
        res = client.post(
            "/api/v1/documents/verify-and-hash",
            headers={"Authorization": f"Bearer {buyer_token}"},
            data={"property_id": 1, "doc_type": "DEED"},
            files={"file": ("test.pdf", fake_pdf, "application/pdf")},
        )
        assert res.status_code == 403, f"Expected 403 for Buyer on Verification, got {res.status_code}: {res.text}"
        print("[PASS] Buyer Denied (403 Forbidden) on Verification module")

        # Owner -> MUST BE 403
        fake_pdf.seek(0)
        res = client.post(
            "/api/v1/documents/verify-and-hash",
            headers={"Authorization": f"Bearer {owner_token}"},
            data={"property_id": 1, "doc_type": "DEED"},
            files={"file": ("test.pdf", fake_pdf, "application/pdf")},
        )
        assert res.status_code == 403, f"Expected 403 for Owner on Verification, got {res.status_code}: {res.text}"
        print("[PASS] Owner Denied (403 Forbidden) on Verification module")

        # Admin -> MUST NOT BE 403
        fake_pdf.seek(0)
        res = client.post(
            "/api/v1/documents/verify-and-hash",
            headers={"Authorization": f"Bearer {admin_token}"},
            data={"property_id": 1, "doc_type": "DEED"},
            files={"file": ("test.pdf", fake_pdf, "application/pdf")},
        )
        assert res.status_code != 403, f"Admin should not be 403 on Verification, got {res.status_code}: {res.text}"
        print(f"[PASS] Admin Allowed access to Verification module (Status: {res.status_code})")

        # Officer -> MUST NOT BE 403
        fake_pdf.seek(0)
        res = client.post(
            "/api/v1/documents/verify-and-hash",
            headers={"Authorization": f"Bearer {officer_token}"},
            data={"property_id": 1, "doc_type": "DEED"},
            files={"file": ("test.pdf", fake_pdf, "application/pdf")},
        )
        assert res.status_code != 403, f"Officer should not be 403 on Verification, got {res.status_code}: {res.text}"
        print(f"[PASS] Government Officer Allowed access to Verification module (Status: {res.status_code})")

        # -------------------------------------------------------------
        # 2. OWNER MODULE TEST (POST /api/v1/properties)
        # -------------------------------------------------------------
        print("\n--- Testing Owner Module Permissions ---")

        # Buyer -> MUST BE 403
        res = client.post(
            "/api/v1/properties",
            headers={"Authorization": f"Bearer {buyer_token}"},
            json={"title": "Test Parcel", "survey_number": "123", "property_type": "Residential", "address": "123 Main St", "city": "Pune", "district": "Haveli", "state": "MH", "pin_code": "411001", "area": 1000, "land_type": "NA", "latitude": 18.52, "longitude": 73.85, "ownership_type": "Sole Ownership", "valuation_in_inr": 5000000},
        )
        assert res.status_code == 403, f"Expected 403 for Buyer on Owner module, got {res.status_code}: {res.text}"
        print("[PASS] Buyer Denied (403 Forbidden) on Owner module (Property Registration)")

        # Government Officer -> MUST BE 403 (Officer restricted only to Verification, Audit, Institutional)
        res = client.post(
            "/api/v1/properties",
            headers={"Authorization": f"Bearer {officer_token}"},
            json={"title": "Test Parcel Gov", "survey_number": "123-G", "property_type": "Residential", "address": "123 Gov St", "city": "Pune", "district": "Haveli", "state": "MH", "pin_code": "411001", "area": 1000, "land_type": "NA", "latitude": 18.52, "longitude": 73.85, "ownership_type": "Sole Ownership", "valuation_in_inr": 5000000},
        )
        assert res.status_code == 403, f"Expected 403 for Officer on Owner module, got {res.status_code}: {res.text}"
        print("[PASS] Government Officer Denied (403 Forbidden) on Owner module (Property Registration)")

        # Owner -> Must NOT be 403
        res = client.post(
            "/api/v1/properties",
            headers={"Authorization": f"Bearer {owner_token}"},
            json={"title": "Test Parcel 2", "survey_number": "124", "property_type": "Residential", "address": "124 Main St", "city": "Pune", "district": "Haveli", "state": "MH", "pin_code": "411001", "area": 1000, "land_type": "NA", "latitude": 18.52, "longitude": 73.85, "ownership_type": "Sole Ownership", "valuation_in_inr": 5000000},
        )
        assert res.status_code != 403, f"Owner should not be 403, got {res.status_code}: {res.text}"
        print(f"[PASS] Owner Allowed access to Owner module (Status: {res.status_code})")

        # Admin -> Must NOT be 403
        res = client.post(
            "/api/v1/properties",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"title": "Test Parcel Admin", "survey_number": "125", "property_type": "Residential", "address": "125 Main St", "city": "Pune", "district": "Haveli", "state": "MH", "pin_code": "411001", "area": 1000, "land_type": "NA", "latitude": 18.52, "longitude": 73.85, "ownership_type": "Sole Ownership", "valuation_in_inr": 5000000},
        )
        assert res.status_code != 403, f"Admin should not be 403, got {res.status_code}: {res.text}"
        print(f"[PASS] Admin Allowed access to Owner module (Status: {res.status_code})")

        # -------------------------------------------------------------
        # 3. INSTITUTIONAL PORTALS TEST (GET /api/v1/users)
        # -------------------------------------------------------------
        print("\n--- Testing Institutional Portal Permissions ---")

        # Buyer -> MUST BE 403
        res = client.get("/api/v1/users", headers={"Authorization": f"Bearer {buyer_token}"})
        assert res.status_code == 403, f"Expected 403 for Buyer on Institutional portal, got {res.status_code}: {res.text}"
        print("[PASS] Buyer Denied (403 Forbidden) on Institutional portal (/users)")

        # Owner -> MUST BE 403
        res = client.get("/api/v1/users", headers={"Authorization": f"Bearer {owner_token}"})
        assert res.status_code == 403, f"Expected 403 for Owner on Institutional portal, got {res.status_code}: {res.text}"
        print("[PASS] Owner Denied (403 Forbidden) on Institutional portal (/users)")

        # Admin -> MUST BE 200
        res = client.get("/api/v1/users", headers={"Authorization": f"Bearer {admin_token}"})
        assert res.status_code == 200, f"Expected 200 for Admin on Institutional portal, got {res.status_code}: {res.text}"
        print(f"[PASS] Admin Granted Full Access on Institutional portal (/users)")

        # Government Registrar -> MUST BE 200
        res = client.get("/api/v1/users", headers={"Authorization": f"Bearer {registrar_token}"})
        assert res.status_code == 200, f"Expected 200 for Registrar on Institutional portal, got {res.status_code}: {res.text}"
        print(f"[PASS] Government Registrar Granted Access on Institutional portal (/users)")

        print("\n================================================================")
        print("   ALL ROLE-BASED ACCESS CONTROL (RBAC) TESTS PASSED!          ")
        print("================================================================")

if __name__ == "__main__":
    test_rbac_permissions()

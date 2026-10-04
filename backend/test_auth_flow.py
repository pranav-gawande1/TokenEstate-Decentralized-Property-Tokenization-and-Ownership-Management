import sys
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_tests():
    print("==================================================")
    print("   TokenEstate Authentication & RBAC Test Suite   ")
    print("==================================================")

    # Test 1: Health check
    res = client.get("/")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("[OK] Health Check Passed")

    # Test 2: Fetch available roles dropdown list
    res = client.get("/api/v1/auth/roles")
    assert res.status_code == 200, f"Get roles failed: {res.text}"
    roles_data = res.json()
    assert len(roles_data) >= 5, "Expected at least 5 roles in list"
    role_names = [r["role"] for r in roles_data]
    print(f"[OK] Available Roles fetched successfully ({len(role_names)} roles): {role_names}")

    # Test 3: Login with seeded demo Admin user
    res = client.post(
        "/api/v1/auth/login",
        json={"username_or_email": "admin@tokenestate.io", "password": "adminpassword123"},
    )
    assert res.status_code == 200, f"Admin login failed: {res.text}"
    admin_auth = res.json()
    admin_token = admin_auth["access_token"]
    assert admin_auth["user"]["role"] == "admin"
    print(f"[OK] Admin Login Successful! User: {admin_auth['user']['username']} | Role: {admin_auth['user']['role']}")

    # Test 4: Access protected /auth/me with Admin JWT token
    res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert res.status_code == 200, f"/auth/me failed: {res.text}"
    me_data = res.json()
    assert me_data["email"] == "admin@tokenestate.io"
    print(f"[OK] Authenticated GET /auth/me Passed! User: {me_data['full_name']}")

    # Test 5: Register new user with 'owner' role
    new_user_payload = {
        "username": "testowner",
        "email": "testowner@tokenestate.io",
        "password": "Password123!",
        "full_name": "Test Property Owner",
        "role": "owner",
        "wallet_address": "0x1234567890123456789012345678901234567890",
    }
    res = client.post("/api/v1/auth/register", json=new_user_payload)
    assert res.status_code in [200, 201], f"Register user failed: {res.text}"
    owner_auth = res.json()
    owner_token = owner_auth["access_token"]
    owner_id = owner_auth["user"]["id"]
    print(f"[OK] User Registration Passed! Created ID={owner_id}, Username={owner_auth['user']['username']}, Role={owner_auth['user']['role']}")

    # Test 6: Attempt unauthorized role list access as regular 'owner' on admin route
    res = client.get(
        "/api/v1/users",
        headers={"Authorization": f"Bearer {owner_token}"},
    )
    assert res.status_code == 403, f"Expected 403 Forbidden for owner, got {res.status_code}: {res.text}"
    print("[OK] RBAC Enforcement Passed! Non-admin user received 403 Forbidden on Admin route")

    # Test 7: Update user role using Admin JWT
    res = client.patch(
        f"/api/v1/users/{owner_id}/role",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"role": "verifier"},
    )
    assert res.status_code == 200, f"Update role failed: {res.text}"
    updated_user = res.json()
    assert updated_user["role"] == "verifier"
    print(f"[OK] Admin PATCH /users/{owner_id}/role Passed! Updated Role: {updated_user['role']}")

    # Test 8: Verify updated role via /auth/me with owner's token
    res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {owner_token}"},
    )
    assert res.status_code == 200
    assert res.json()["role"] == "verifier"
    print("[OK] Verification of updated user role via JWT session Passed!")

    print("\n==================================================")
    print("    ALL AUTHENTICATION & RBAC TESTS PASSED!       ")
    print("==================================================")

if __name__ == "__main__":
    run_tests()

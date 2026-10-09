from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from documentVerification.routers.verification_router import router as document_router
from authentication.router import auth_router, user_router

app = FastAPI(
    title="TokenEstate Document Verification & Anti-Fraud Engine",
    version="1.0.0",
    description="3-Layer Document Forensics, Cryptographic Hashing, and IPFS Gateway for Polygon Real Estate."
)

# Enable CORS for your Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the routers
app.include_router(document_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(user_router, prefix="/api/v1")

@app.get("/")
def health_check():
    return {"status": "online", "network": "Polygon Amoy", "engine": "FastAPI + Web3"}
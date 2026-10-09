
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from documentVerification.routers.verification_router import (
    router as document_router,
)

app = FastAPI(
    title="TokenEstate Document Verification & Anti-Fraud Engine",
    version="1.0.0",
    description=(
        "3-Layer Document Forensics, Cryptographic Hashing, "
        "and IPFS Gateway for Polygon Real Estate."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the document verification router
app.include_router(document_router, prefix="/api/v1")


@app.get("/")
async def health_check():
    return {
        "status": "online",
        "network": "Polygon Amoy",
        "engine": "FastAPI + Web3",
    }


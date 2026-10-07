from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine

from authentication.models import User  # noqa: F401
from propertyRegistration.models.property import Property  # noqa: F401

from documentVerification.routers.verification_router import (
    router as document_router,
)
from authentication.router import auth_router, user_router
from propertyRegistration.api.routers.properties import router as property_router


@asynccontextmanager
async def lifespan(app: FastAPI):

    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    except Exception as e:
        print(type(e).__name__)
        print(str(e))
        raise

    yield

    await engine.dispose()


app = FastAPI(
    title="TokenEstate Document Verification & Anti-Fraud Engine",
    version="1.0.0",
    description=(
        "3-Layer Document Forensics, Cryptographic Hashing, "
        "and IPFS Gateway for Polygon Real Estate."
    ),
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(document_router,prefix="/api/v1",)

app.include_router(auth_router,prefix="/api/v1",)

app.include_router(user_router,prefix="/api/v1",)

app.include_router(property_router, prefix="/api/v1")

@app.get("/")
async def health_check():
    return {
        "status": "online",
        "network": "Polygon Amoy",
        "engine": "FastAPI + Web3",
    }
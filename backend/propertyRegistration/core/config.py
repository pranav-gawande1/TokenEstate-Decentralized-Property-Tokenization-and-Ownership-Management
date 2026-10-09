from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_env: str = "development"
    database_url: str = "postgresql+asyncpg://postgres:password@localhost:5432/property_registration"
    polygon_rpc_url: str = ""
    polygon_chain_id: int = 80002
    property_registry_address: str = ""
    registrar_private_key: str = ""
    polygon_explorer_url: str = "https://amoy.polygonscan.com"
    blockchain_confirmation_timeout: int = 120
    blockchain_poll_interval: float = 3.0
    blockchain_service: str = Field(default="mock", pattern="^(mock|polygon)$")
    demo_user_id: str = "demo-user-001"
    demo_wallet_address: str = "0x000000000000000000000000000000000000dEaD"
    demo_user_role: str = "PROPERTY_OWNER"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

@lru_cache
def get_settings() -> Settings:
    return Settings()
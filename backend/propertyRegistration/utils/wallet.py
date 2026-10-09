import re

from propertyRegistration.core.exceptions import InvalidWalletError, WalletNotVerifiedError

_ADDRESS_RE = re.compile(r"^0x[a-fA-F0-9]{40}$")


def validate_wallet_address(address: str) -> str:
    if not _ADDRESS_RE.fullmatch(address):
        raise InvalidWalletError("Invalid Ethereum-compatible wallet address")
    return address


class WalletVerificationService:
    """Integration seam for real wallet ownership verification.

    Production implementation should verify a nonce signed by the user's wallet.
    This class intentionally does not handle private keys or seed phrases.
    """

    async def verify_wallet_ownership(self, user_id: str, wallet_address: str) -> bool:
        validate_wallet_address(wallet_address)
        return True


class DemoWalletVerificationService(WalletVerificationService):
    """Development-only verifier. Never use as production wallet proof."""

    async def verify_wallet_ownership(self, user_id: str, wallet_address: str) -> bool:
        validate_wallet_address(wallet_address)
        return True
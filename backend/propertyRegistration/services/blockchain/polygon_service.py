import asyncio
import json
from pathlib import Path

from eth_account import Account
from web3 import Web3
from web3.exceptions import TimeExhausted, TransactionNotFound, Web3Exception

from propertyRegistration.core.exceptions import BlockchainConnectionError, BlockchainTransactionError, BlockchainVerificationError
from propertyRegistration.services.blockchain.blockchain_interface import BlockchainProperty, BlockchainRegistrationResult, TransactionStatus
from propertyRegistration.core.config import Settings


class PolygonBlockchainService:
    """Polygon Amoy adapter.

    The registrar private key is loaded only from secret configuration. This class
    never logs or returns it. The ABI is expected at contracts/artifacts/... when
    using the standalone repository, or can be supplied through an integration path.
    """

    def __init__(self, settings: Settings, abi_path: str | None = None):
        if not settings.polygon_rpc_url or not settings.property_registry_address or not settings.registrar_private_key:
            raise BlockchainConnectionError("Polygon service is missing required configuration")
        self.settings = settings
        self.w3 = Web3(Web3.HTTPProvider(settings.polygon_rpc_url, request_kwargs={"timeout": 30}))
        if not self.w3.is_connected():
            raise BlockchainConnectionError("Unable to connect to Polygon RPC")
        if self.w3.eth.chain_id != settings.polygon_chain_id:
            raise BlockchainConnectionError("Connected RPC chain ID does not match configured chain ID")
        self.account = Account.from_key(settings.registrar_private_key)
        abi_file = Path(abi_path or "../contracts/artifacts/contracts/PropertyRegistry.sol/PropertyRegistry.json")
        try:
            artifact = json.loads(abi_file.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            raise BlockchainConnectionError("PropertyRegistry ABI artifact could not be loaded") from exc
        self.contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(settings.property_registry_address), abi=artifact["abi"]
        )

    def _property_key(self, property_id: str) -> bytes:
        return Web3.keccak(text=property_id)

    async def register_property(self, property_id: str, owner: str, metadata_hash: str) -> BlockchainRegistrationResult:
        try:
            owner = Web3.to_checksum_address(owner)
            property_key = self._property_key(property_id)
            metadata_bytes = bytes.fromhex(metadata_hash.removeprefix("0x"))
            nonce = self.w3.eth.get_transaction_count(self.account.address, "pending")
            tx = self.contract.functions.registerProperty(property_key, owner, metadata_bytes).build_transaction({
                "from": self.account.address,
                "nonce": nonce,
                "chainId": self.settings.polygon_chain_id,
                "gas": 300000,
                "maxFeePerGas": self.w3.to_wei(100, "gwei"),
                "maxPriorityFeePerGas": self.w3.to_wei(30, "gwei"),
            })
            signed = self.w3.eth.account.sign_transaction(tx, self.settings.registrar_private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed.raw_transaction)
            try:
                receipt = self.w3.eth.wait_for_transaction_receipt(
                    tx_hash, timeout=self.settings.blockchain_confirmation_timeout,
                    poll_latency=self.settings.blockchain_poll_interval,
                )
            except TimeExhausted:
                return BlockchainRegistrationResult(property_id, owner, metadata_hash, tx_hash.hex(), None,
                    self.contract.address, self.settings.polygon_chain_id, TransactionStatus.CONFIRMATION_TIMEOUT)
            if receipt["status"] != 1:
                return BlockchainRegistrationResult(property_id, owner, metadata_hash, tx_hash.hex(), receipt.get("blockNumber"),
                    self.contract.address, self.settings.polygon_chain_id, TransactionStatus.FAILED)

            # Parse the contract event so the adapter verifies that the expected
            # registration was actually emitted by PropertyRegistry.
            events = self.contract.events.PropertyRegistered().process_receipt(receipt)
            if not events:
                raise BlockchainTransactionError("Confirmed transaction did not emit PropertyRegistered")
            event = events[0]["args"]
            expected_key = self._property_key(property_id)
            if event["propertyId"] != expected_key or event["owner"] != owner or event["metadataHash"] != metadata_bytes:
                raise BlockchainTransactionError("PropertyRegistered event did not match requested registration")

            return BlockchainRegistrationResult(property_id, owner, metadata_hash, tx_hash.hex(), receipt["blockNumber"],
                self.contract.address, self.settings.polygon_chain_id, TransactionStatus.CONFIRMED)
        except Web3Exception as exc:
            raise BlockchainTransactionError("Polygon transaction failed") from exc

    async def get_property(self, property_id: str) -> BlockchainProperty:
        try:
            raw = self.contract.functions.getProperty(self._property_key(property_id)).call()
            return BlockchainProperty(raw[0].hex(), raw[1], raw[2].hex(), raw[3], raw[4])
        except Web3Exception as exc:
            raise BlockchainConnectionError("Unable to read property from Polygon") from exc

    async def verify_property(self, property_id: str, expected_metadata_hash: str) -> bool:
        record = await self.get_property(property_id)
        if not record.exists:
            raise BlockchainVerificationError("Property does not exist on blockchain")
        return record.metadata_hash.lower() == expected_metadata_hash.lower()

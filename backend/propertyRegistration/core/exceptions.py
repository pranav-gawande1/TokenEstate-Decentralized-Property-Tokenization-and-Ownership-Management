class PropertyAlreadyExistsError(Exception):
    pass


class PropertyNotFoundError(Exception):
    pass


class InvalidWalletError(Exception):
    pass


class WalletNotVerifiedError(Exception):
    pass


class BlockchainConnectionError(Exception):
    pass


class BlockchainTransactionError(Exception):
    pass


class BlockchainVerificationError(Exception):
    pass


class UnauthorizedRegistrationError(Exception):
    pass

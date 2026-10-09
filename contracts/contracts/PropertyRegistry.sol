// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract PropertyRegistry is AccessControl {
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    struct Property {
        bytes32 propertyId;
        address owner;
        bytes32 metadataHash;
        uint256 registeredAt;
        bool exists;
    }

    mapping(bytes32 => Property) private properties;

    error InvalidPropertyId();
    error InvalidOwner();
    error PropertyAlreadyExists(bytes32 propertyId);

    event PropertyRegistered(
        bytes32 indexed propertyId,
        address indexed owner,
        bytes32 metadataHash,
        uint256 registeredAt
    );

    constructor(address admin, address registrar) {
        if (admin == address(0) || registrar == address(0)) revert InvalidOwner();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REGISTRAR_ROLE, registrar);
    }

    function registerProperty(bytes32 propertyId, address owner, bytes32 metadataHash)
        external
        onlyRole(REGISTRAR_ROLE)
    {
        if (propertyId == bytes32(0)) revert InvalidPropertyId();
        if (owner == address(0)) revert InvalidOwner();
        if (properties[propertyId].exists) revert PropertyAlreadyExists(propertyId);

        uint256 timestamp = block.timestamp;
        properties[propertyId] = Property(propertyId, owner, metadataHash, timestamp, true);
        emit PropertyRegistered(propertyId, owner, metadataHash, timestamp);
    }

    function getProperty(bytes32 propertyId) external view returns (Property memory) {
        return properties[propertyId];
    }

    function propertyExists(bytes32 propertyId) external view returns (bool) {
        return properties[propertyId].exists;
    }
}

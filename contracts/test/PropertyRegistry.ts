import { expect } from "chai";
import { ethers } from "hardhat";

describe("PropertyRegistry", function () {
  async function deploy() {
    const [admin, registrar, owner, other] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("PropertyRegistry");
    const registry = await factory.deploy(admin.address, registrar.address);
    await registry.waitForDeployment();
    return { registry, admin, registrar, owner, other };
  }

  it("assigns admin and registrar roles", async function () {
    const { registry, admin, registrar } = await deploy();
    expect(await registry.hasRole(await registry.DEFAULT_ADMIN_ROLE(), admin.address)).to.equal(true);
    expect(await registry.hasRole(await registry.REGISTRAR_ROLE(), registrar.address)).to.equal(true);
  });

  it("registers and retrieves a property", async function () {
    const { registry, registrar, owner } = await deploy();
    const id = ethers.keccak256(ethers.toUtf8Bytes("PROP-1"));
    const hash = ethers.keccak256(ethers.toUtf8Bytes("metadata"));
    await expect(registry.connect(registrar).registerProperty(id, owner.address, hash)).to.emit(registry, "PropertyRegistered");
    const property = await registry.getProperty(id);
    expect(property.propertyId).to.equal(id);
    expect(property.owner).to.equal(owner.address);
    expect(property.metadataHash).to.equal(hash);
    expect(property.exists).to.equal(true);
    expect(await registry.propertyExists(id)).to.equal(true);
  });

  it("rejects unauthorized registration", async function () {
    const { registry, other, owner } = await deploy();
    const id = ethers.keccak256(ethers.toUtf8Bytes("PROP-1"));
    const hash = ethers.keccak256(ethers.toUtf8Bytes("metadata"));
    await expect(registry.connect(other).registerProperty(id, owner.address, hash)).to.be.reverted;
  });

  it("rejects duplicate property IDs", async function () {
    const { registry, registrar, owner } = await deploy();
    const id = ethers.keccak256(ethers.toUtf8Bytes("PROP-1"));
    const hash = ethers.keccak256(ethers.toUtf8Bytes("metadata"));
    await registry.connect(registrar).registerProperty(id, owner.address, hash);
    await expect(registry.connect(registrar).registerProperty(id, owner.address, hash)).to.be.revertedWithCustomError(registry, "PropertyAlreadyExists");
  });

  it("rejects zero owner and zero property ID", async function () {
    const { registry, registrar } = await deploy();
    const id = ethers.keccak256(ethers.toUtf8Bytes("PROP-1"));
    const hash = ethers.keccak256(ethers.toUtf8Bytes("metadata"));
    await expect(registry.connect(registrar).registerProperty(id, ethers.ZeroAddress, hash)).to.be.revertedWithCustomError(registry, "InvalidOwner");
    await expect(registry.connect(registrar).registerProperty(ethers.ZeroHash, registrar.address, hash)).to.be.revertedWithCustomError(registry, "InvalidPropertyId");
  });

  it("grants and revokes registrar role", async function () {
    const { registry, admin, other, owner } = await deploy();
    const role = await registry.REGISTRAR_ROLE();
    await registry.connect(admin).grantRole(role, other.address);
    expect(await registry.hasRole(role, other.address)).to.equal(true);
    const id = ethers.keccak256(ethers.toUtf8Bytes("PROP-2"));
    const hash = ethers.keccak256(ethers.toUtf8Bytes("metadata"));
    await registry.connect(other).registerProperty(id, owner.address, hash);
    await registry.connect(admin).revokeRole(role, other.address);
    expect(await registry.hasRole(role, other.address)).to.equal(false);
    const id2 = ethers.keccak256(ethers.toUtf8Bytes("PROP-3"));
    await expect(registry.connect(other).registerProperty(id2, owner.address, hash)).to.be.reverted;
  });
});

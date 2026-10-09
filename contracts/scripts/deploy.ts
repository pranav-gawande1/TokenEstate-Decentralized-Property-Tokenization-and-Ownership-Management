import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const registrar = process.env.REGISTRAR_ADDRESS || deployer.address;
  const Registry = await ethers.getContractFactory("PropertyRegistry");
  const registry = await Registry.deploy(deployer.address, registrar);
  await registry.waitForDeployment();

  console.log(`Network: ${network.name}`);
  console.log(`Chain ID: ${(await ethers.provider.getNetwork()).chainId}`);
  console.log(`Admin: ${deployer.address}`);
  console.log(`Registrar: ${registrar}`);
  console.log(`PropertyRegistry: ${await registry.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

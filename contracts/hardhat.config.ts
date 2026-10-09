import "@nomicfoundation/hardhat-toolbox";
import { defineConfig } from "hardhat/config";

export default defineConfig({
  solidity: "0.8.24",
  networks: {
    hardhat: {},
    localhost: { url: "http://127.0.0.1:8545" },
    polygonAmoy: {
      url: process.env.POLYGON_AMOY_RPC_URL || "",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 80002,
    },
  },
});

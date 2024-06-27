import { HardhatUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
const dotenv = require("dotenv");
dotenv.config();

const config: HardhatUserConfig = {

  solidity: "0.8.20",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "../artifacts"
  },
  networks: {
    polygonAmoy: {
        url: process.env.JSON_RPC_PROVIDER_AMOY,
        accounts: [`0x59aa2f4fc9246210371d90a51e3c93c4e3eee7c431d150cc3f2b439626c17c36`]
    },
    sepolia: {
        url: process.env.JSON_RPC_PROVIDER_SEPOLIA,
        accounts: [`0x59aa2f4fc9246210371d90a51e3c93c4e3eee7c431d150cc3f2b439626c17c36`]
    }
},
etherscan : {
    apiKey : {
        sepolia : process.env.ETHERSCAN_API_KEY,
        polygonAmoy : process.env.POLYGONSCAN_API_KEY
    },
},
sourcify: {
    enabled: true
},

typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
}
};

export default config;

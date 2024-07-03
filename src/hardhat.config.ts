import { HardhatUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "@nomiclabs/hardhat-etherscan";

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
    hardhat: {},
    polygonAmoy: {
        url: process.env.JSON_RPC_PROVIDER_AMOY,
        accounts: [`0x59aa2f4fc9246210371d90a51e3c93c4e3eee7c431d150cc3f2b439626c17c36`],
        chainId: 80002
    },
    sepolia: {
        url: process.env.JSON_RPC_PROVIDER_SEPOLIA,
        accounts: [`0x59aa2f4fc9246210371d90a51e3c93c4e3eee7c431d150cc3f2b439626c17c36`],
        chainId: 11155111
    }
},
etherscan : {
    apiKey : {
        sepolia : process.env.ETHERSCAN_API_KEY,
        polygonAmoy : process.env.POLYGONSCAN_API_KEY
    },
    customChains: [
        {
          network: "polygonAmoy",
          chainId: 80002,
          urls: {
            apiURL: "https://api-amoy.polygonscan.com/api",
            browserURL: "https://amoy.polygonscan.com"
          }
        },
        {
          network: "sepolia",
          chainId: 11155111,
          urls: {
            apiURL: "https://api-sepolia.etherscan.io/api",
            browserURL: "https://sepolia.etherscan.io"
          }
        }
      ]
  
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

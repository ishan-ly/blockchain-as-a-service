
require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");
dotenv.config();
const config = {
    solidity: "0.8.20",
    paths: {
        sources: "./src/contracts",
        tests: "./src/test",
        cache: "./src/cache",
        artifacts: "./artifacts"
    },
    networks: {
        amoy: {
            url: process.env.JSON_RPC_PROVIDER,
            accounts: [`0x59aa2f4fc9246210371d90a51e3c93c4e3eee7c431d150cc3f2b439626c17c36`]
        }
    },
    typechain: {
        outDir: "typechain-types",
        target: "ethers-v6",
    },
};
module.exports = config;

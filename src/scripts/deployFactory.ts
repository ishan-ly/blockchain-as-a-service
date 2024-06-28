import { ethers } from "hardhat";

async function main() {
  const ERC20Factory = await ethers.getContractFactory("ERC721Factory");
  const erc20Factory = await ERC20Factory.deploy();
  await erc20Factory.waitForDeployment();

  console.log("ERC20Factory deployed to:", erc20Factory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

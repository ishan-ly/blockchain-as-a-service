import { ethers } from "hardhat";

async function main() {
  const provider : any = new ethers.JsonRpcProvider("https://polygon-amoy.g.alchemy.com/v2/1i-JadBalM7Dp1PnYL76aG1vREB_yfGp");  
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const ERC20Factory = await ethers.getContractFactory("ERC20Factory", wallet);
  const erc20Factory = await ERC20Factory.deploy();
  await erc20Factory.waitForDeployment();

  console.log("ERC20Factory deployed to:", erc20Factory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

import { run } from "hardhat";

async function main() {
    try {
        const tokenAddress="0x5ce3D6f47297aa26687dC2c7a6889FE5F6C01878";
        const name="Loyyal Token5";
        const symbol="LOYL5";
        const initialSupply=1000000;
        const decimals=18;
        const initialOwner="0xe8F910b8eD19BC258b20A0c86e292394EfE38318";

        await run("verify:verify", {
            address: tokenAddress,
            constructorArguments: [name, symbol, initialSupply, decimals, initialOwner],
        });
        console.log("Contract verified successfully");
    } catch (error) {
        console.error("Verification failed:", error);
        throw new Error("Contract verification failed");
    }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

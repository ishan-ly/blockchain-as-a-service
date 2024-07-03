import { run } from "hardhat";

async function main() {
    try {
        const tokenAddress="0x098e6b28C1948054807ba740f691b8de503b2B33";
        const name="Loyyal Token1017";
        const symbol="LOY1017";
        const initialSupply=1000000;
        const decimals=18;
        const initialOwner="0xe8F910b8eD19BC258b20A0c86e292394EfE38318";

        await run("verify:verify", {
            address: tokenAddress,
            constructorArguments: [initialOwner, name, symbol],
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

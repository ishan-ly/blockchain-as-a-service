import { run } from "hardhat";

async function main() {
    try {
        const tokenAddress="0x81D0de4FB37d5B2b5A9719db2F87e8e915C9acE9";
        const name="T20 World Cup Final";
        const symbol="IND";
        const initialSupply=1000000;
        const decimals=18;
        const initialOwner="0xe8F910b8eD19BC258b20A0c86e292394EfE38318";

        await run("verify:verify", {
            address: tokenAddress,
            constructorArguments: [name, symbol, initialOwner],
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

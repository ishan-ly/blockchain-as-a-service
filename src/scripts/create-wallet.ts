const { ethers } = require("ethers");


function main() {
    const wallet = ethers.Wallet.createRandom();
    console.log("Address: ", wallet.address);
    console.log("Mnemonic: ", wallet.mnemonic.phrase);
    console.log("Private Key: ", wallet.privateKey);
}

main();

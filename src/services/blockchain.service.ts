import { InvalidInputError } from "../errors/invalid-input.error";
import { CustomResponse } from "../models/custom-response.model";
import { LoyyalTokenTransfer } from "../models/loyyal-token-transfer.model";
import { CommonUtils } from "../utils/common.utils";
import { MongoUtils } from "../utils/mongo.utils";
import { ethers, run , network, config} from "hardhat";
import { configChain } from "../../config/config-chain"
import { NotificationService } from "./notification.service";
import path from "path";
import axios from "axios";
import fs from "fs"
export class BlockchainService {

    async getNFTsByAddress(): Promise<any> {
       

    }
    async submitNFTAirdopDetails(request: any): Promise<any> {
        const connection = new MongoUtils();
        try {
            if (!request.nftContractAddress) { throw new InvalidInputError('nftContractAddress is required'); }
            if (!request.nftTokenId) { throw new InvalidInputError('nftTokenId is required'); }
            if (!request.transactionHash) { throw new InvalidInputError('transactionHash is required'); }
            if (!request.name) { throw new InvalidInputError('name is required'); }
            if (!request.emailAddress) { throw new InvalidInputError('emailAddress is required'); }
            if (!request.eventName) { throw new InvalidInputError('eventName is required'); }

            const airdropDetails = {
                nftContractAddress: request.nftContractAddress,
                nftTokenId: request.nftTokenId,
                nftImageUrl: request.nftImageUrl,
                chainId: request.chainId,
                explorerBaseUrl: request.explorerBaseUrl,
                transactionHash: request.transactionHash,
                name: request.name,
                emailAddress: request.emailAddress,
                wallet: {
                    publicKey: request.publicKey,
                    privateKey: request.privateKey,
                    mnemonics: request.mnemonics
                },  
                metadata: {
                    eventName: request.eventName,
                    eventOn: new Date(request.eventOn),
                },
                createdOn: new Date(),
            }

            connection.connect();
            await connection.saveAirdropDetails('nft_airdrops', airdropDetails);
            await new NotificationService().sentNFTAirdrops(request.emailAddress, request.name, request.nftImageUrl, request.nftContractAddress, `${request.explorerBaseUrl}/address/${request.nftContractAddress}#code`)
            const response: CustomResponse = new CustomResponse(200, "airdrop details successfully added", null, null)
            return response;
        } catch (error) {
            return CommonUtils.prepareErrorMessage(error);
        } finally {
            connection.disconnect();
        }
    }

    private async initializeContract(JSON_RPC_PROVIDER, contractAddress, ABI) {
        try {
            const provider = new ethers.JsonRpcProvider(JSON_RPC_PROVIDER);
            const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
            return new ethers.Contract(contractAddress, ABI, wallet);
        } catch (error) {
            return CommonUtils.prepareErrorMessage(error);
        }       
    }

    public async deployContract(req : any) : Promise<CustomResponse> {
        const connection = new MongoUtils();
        connection.connect();

        try {
            
            if(!req.body.tokenStandard) throw new InvalidInputError("tokenStandard is required");
            if(!req.body.network) throw new InvalidInputError("network is required");   
            const {network, tokenStandard } = req.body;
            if(!configChain.chains.includes(network)) throw new InvalidInputError(`${network} network is not supported yet`);
            const configuration = configChain[network];

            console.log(`-------------Deployment of ${tokenStandard} contract started on ${network}--------------- `);
            
            switch(tokenStandard) {
                case 'ERC20' : {
                    if(!req.body.arguments.initialSupply) throw new InvalidInputError("initialSuppply is required");
                    if(!req.body.arguments.decimals) throw new InvalidInputError("decimals is required");
                    if(!req.body.arguments.mintable) throw new InvalidInputError("mintable is required");
                    if(!req.body.arguments.name) throw new InvalidInputError("name is required");
                    if(!req.body.arguments.symbol) throw new InvalidInputError("symbol is required");
                    const {initialSupply, decimals, mintable, name, symbol} = req.body.arguments;

                    const factoryContract : any = await this.initializeContract(configuration.JSON_RPC_PROVIDER, configuration.ERC20_FACTORY_CONTRACT_ADDRESS, configuration.ERC20_FACTORY_ABI);
                    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, new ethers.JsonRpcProvider(configuration.JSON_RPC_PROVIDER));

                    const tx = await factoryContract.createTokenERC20(name, symbol, initialSupply, decimals);
                    const receipt = await tx.wait();

                    // Assume ContractDeployed is the event emitted and it has a tokenAddress field
                    const eventSignature = ethers.id("ContractDeployed(address)");

                    // Find the log that matches the ContractDeployed event
                    const eventLog = receipt.logs.find(log => log.topics[0] === eventSignature);
                    let tokenAddress;
                    if (eventLog) {
                        // Decode the log data
                        const decodedLog = factoryContract.interface.decodeEventLog("ContractDeployed", eventLog.data, eventLog.topics);
                        tokenAddress = decodedLog.tokenAddress;
                        console.log("Token contract address:", tokenAddress);
                        console.log("Transaction hash: ", tx.hash);

                        try {
                            await this.verifyContract(tokenAddress, [name, symbol, initialSupply, decimals, wallet.address], network);

                        } catch (error) {
                            console.error("Verification failed:", error);
                        }
                    } else {
                        console.error("ContractDeployed event not found in the transaction receipt");
                    }
                    //store in db
                    await connection.insert("erc20_deployed_contracts", {tokenAddress, txHash : tx.hash, creatorAddress : wallet.address , explorerUrl :`${configuration.EXPLORER_BASE_URL}/token/${tokenAddress}`, network});
                    return new CustomResponse(200, "Contract deployed successfully ", null, {tokenAddress, txHash : tx.hash, creatorAddress : wallet.address , explorerUrl :`${configuration.EXPLORER_BASE_URL}/token/${tokenAddress}`, network});

                }
                case 'ERC721' : {
                    if(!req.body.arguments.name) throw new InvalidInputError("name is required");
                    if(!req.body.arguments.symbol) throw new InvalidInputError("symbol is required");
                    const {name, symbol} = req.body.arguments;

                    const factoryContract : any = await this.initializeContract(configuration.JSON_RPC_PROVIDER, configuration.ERC721_FACTORY_CONTRACT_ADDRESS, configuration.ERC721_FACTORY_ABI);
                    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, new ethers.JsonRpcProvider(configuration.JSON_RPC_PROVIDER));

                    const tx = await factoryContract.createERC721(name, symbol);
                    const receipt = await tx.wait();

                    // Assume ContractDeployed is the event emitted and it has a tokenAddress field
                    const eventSignature = ethers.id("ERC721Created(address)");

                    // Find the log that matches the ERC721Created event
                    const eventLog = receipt.logs.find(log => log.topics[0] === eventSignature);
                    let tokenAddress;
                    if (eventLog) {
                        // Decode the log data
                        const decodedLog = factoryContract.interface.decodeEventLog("ERC721Created", eventLog.data, eventLog.topics);
                        tokenAddress = decodedLog.tokenAddress;
                        console.log("Token contract address:", tokenAddress);
                        console.log("Transaction hash: ", tx.hash);

                        try {
                            await this.verifyContract(tokenAddress, [name, symbol, wallet.address], network);

                        } catch (error) {
                            console.error("Verification failed:", error);
                        }
                    } else {
                        console.error("ContractDeployed event not found in the transaction receipt");
                    }
                    await connection.insert("erc721_deployed_contracts", {tokenAddress, txHash : tx.hash, creatorAddress : wallet.address , explorerUrl :`${configuration.EXPLORER_BASE_URL}/token/${tokenAddress}`, network});
                    return new CustomResponse(200, "Contract ERC721 deployed successfully ", null, {tokenAddress, txHash : tx.hash, creatorAddress : wallet.address , explorerUrl :`${configuration.EXPLORER_BASE_URL}/token/${tokenAddress}`, network});
                }
                case 'ERC1155' : {
                    if(!req.body.arguments.name) throw new InvalidInputError("name is required");
                    if(!req.body.arguments.symbol) throw new InvalidInputError("symbol is required");
                    const {name, symbol} = req.body.arguments;

                    const factoryContract : any = await this.initializeContract(configuration.JSON_RPC_PROVIDER, configuration.ERC1155_FACTORY_CONTRACT_ADDRESS, configuration.ERC1155_FACTORY_ABI);
                    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, new ethers.JsonRpcProvider(configuration.JSON_RPC_PROVIDER));

                    const tx = await factoryContract.createERC1155(name, symbol);
                    const receipt = await tx.wait();

                    // Assume ContractDeployed is the event emitted and it has a tokenAddress field
                    const eventSignature = ethers.id("ERC1155Created(address)");

                    // Find the log that matches the ERC721Created event
                    const eventLog = receipt.logs.find(log => log.topics[0] === eventSignature);
                    let tokenAddress;
                    if (eventLog) {
                        // Decode the log data
                        const decodedLog = factoryContract.interface.decodeEventLog("ERC1155Created", eventLog.data, eventLog.topics);
                        tokenAddress = decodedLog.tokenAddress;
                        console.log("Token contract address:", tokenAddress);
                        console.log("Transaction hash: ", tx.hash);

                        try {
                            await this.verifyContract(tokenAddress, [wallet.address, name, symbol], network);

                        } catch (error) {
                            console.error("Verification failed:", error);
                        }
                    } else {
                        console.error("ContractDeployed event not found in the transaction receipt");
                    }
                    await connection.insert("erc1155_deployed_contracts", {tokenAddress, txHash : tx.hash, creatorAddress : wallet.address , explorerUrl :`${configuration.EXPLORER_BASE_URL}/token/${tokenAddress}`, network});
                    return new CustomResponse(200, "Contract ERC1155 deployed successfully ", null, {tokenAddress, txHash : tx.hash, creatorAddress : wallet.address , explorerUrl :`${configuration.EXPLORER_BASE_URL}/token/${tokenAddress}`, network});
                }
            }
        } catch (error) {
            return CommonUtils.prepareErrorMessage(error);
        }
    }

    public async verifyContract(tokenAddress, constructorArguments, networks) {
        try {
            console.log(`-------------Contract verification started on ${networks}---------------`);
            network.name=networks
            await run("verify:verify", { address: tokenAddress, constructorArguments});
            console.log("Contract verified successfully");
            return;
        } catch (error) {
            console.error("Verification failed:", error);
            throw new Error("Contract verification failed");
        }
    }

    // public async setNetwork (networkName) {
    //     const networkConfig = config.networks?.[networkName];
    // if (!networkConfig) {
    //   throw new Error(`Network configuration for '${networkName}' not found`);
    // }

    // network.config = networkConfig;
    // network.name = networkName;

    // // Reset provider to apply the new network configuration
    // ethers.provider = new ethers.JsonRpcProvider(networkConfig.url, {
    //   name: networkName,
    //   chainId: networkConfig.chainId,
    // });
    //   };

    public async verifyContract1(req : any) {
        try {
            const name = "Loyyall Token";
            const symbol = "LOYL";
            const initialSupply = 1000000;
            const decimals = 18;
            const initialOwner = "0xe8F910b8eD19BC258b20A0c86e292394EfE38318"

            const flattenedCodePath = path.resolve(__dirname, '..', 'flattened', 'ERC20Token_flat.sol');
            const flattenedCode = fs.readFileSync(flattenedCodePath, 'utf8');

            const contractSource = ""
            const encodedArgs =  new ethers.AbiCoder().encode(
                ["string", "string", "uint256", "uint8", "address"],
                [name, symbol, initialSupply, decimals, initialOwner])

            const constructorArguments = encodedArgs.slice(2); // Remove '0x' prefix
            console.log(constructorArguments)


            const response = await axios.post('https://api-sepolia.etherscan.io/api', null, {
            params: {
                module: 'contract',
                action: 'verifysourcecode',
                apikey: process.env.ETHERSCAN_API_KEY,
                contractaddress: "0xc4466C80587092d4c1C3033ea4b2fCdbD661fdA6",
                sourceCode: flattenedCode,
                contractname: "ERC20Token",
                compilerversion: "v0.8.20+commit.a1b79de6",
                constructorArguements: constructorArguments,
                optimizationUsed: 1,
                runs: 200,
                licenseType : 1
            },
            });
            console.log(response)

            if (response.data.status === '1') {
                return new CustomResponse(200, "Contract verification submitted successfully", null, response.data.result);
            } 
        } catch (error) {
            return CommonUtils.prepareErrorMessage(error);
        }
    }

    public async getAllTransferTransactions() : Promise<CustomResponse> {
        try {
            const connection = new MongoUtils();
            connection.connect();
            const data = await connection.filter("erc20_transactions",{}, null);

            let tokenTransfer = data.map((x) => ( new LoyyalTokenTransfer(x))) 
            return new CustomResponse(200, "List of transfer transactions of Loyyal token", null, tokenTransfer);
        } catch (error) {
            return CommonUtils.prepareErrorMessage(error);
        }
    }

    // Function to check if a function name exists in the ABI
    private async isFunctionInABI (abi: any[], functionName: string)  {
        return abi.some(item => item.type == 'function' && item.name == functionName);
    };

    public async readContractERC20(req : any) : Promise<CustomResponse> {
        try {
            if(!req.body.method) throw new InvalidInputError("method is required");
            if(!req.body.contractAddress) throw new InvalidInputError("contractAddress is required");
            if(!req.body.network) throw new InvalidInputError("network is required");   

            const {method, contractAddress, network} = req.body;
            const configuration = configChain[network];
            if(!await this.isFunctionInABI(configuration.ERC20_ABI, method)) throw new InvalidInputError(`This method is not available for ERC20 token standard`);
            const contract : any = await this.initializeContract(configuration.JSON_RPC_PROVIDER, contractAddress, configuration.ERC20_ABI);
            
            switch(method) {
                case 'totalSupply' : {
                    const totalSupply = await contract.totalSupply();
                    console.log('totalSupply is ', totalSupply.toString(), ' wei');
                    return new CustomResponse(200, "Total supply fetched successfully", null, {totalSupply : totalSupply.toString()});
                }
                case 'name' : {
                    const name = await contract.name();
                    console.log('name is ', name.toString());
                    return new CustomResponse(200, "name fetched successfully", null, {name});
                }
                case 'symbol' : {
                    const symbol = await contract.symbol();
                    console.log('symbol is ', symbol.toString());
                    return new CustomResponse(200, "symbol fetched successfully", null, {symbol});
                }
                case 'owner': {
                    const owner = await contract.owner();
                    console.log('owner is ', owner.toString());
                    return new CustomResponse(200, "owner fetched successfully", null, {owner});
                }
                case 'balanceOf': {
                    if(!req.body.arguments.accountAddress) throw new InvalidInputError("accountAddress is required");
                    const {accountAddress} = req.body.arguments;
                    const balance = await contract.balanceOf(accountAddress);
                    console.log('balance is ', balance.toString(), ' wei');
                    return new CustomResponse(200, "Balance fetched successfully", null, {balance : balance.toString()});
                }
                default: 
                    console.log("default case");
                    return new CustomResponse(400, "This functionality is not supported yet", null, null);
            }
        } catch (error) {
            return CommonUtils.prepareErrorMessage(error);
        }
    }

    public async writeContractERC20(req: any) : Promise<CustomResponse> {
        const connection = new MongoUtils();
        connection.connect();
        try {
            if(!req.body.method) throw new InvalidInputError("method is required");
            if(!req.body.contractAddress) throw new InvalidInputError("contractAddress is required");
            if(!req.body.network) throw new InvalidInputError("network is required");   

            const {method, contractAddress, network} = req.body;
            const configuration = configChain[network];
            const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, new ethers.JsonRpcProvider(configuration.JSON_RPC_PROVIDER));

            if(! await this.isFunctionInABI(configuration.ERC20_ABI, method)) throw new InvalidInputError(`This method is not available for ERC20 token standard`)
            const contract : any = await this.initializeContract(configuration.JSON_RPC_PROVIDER, contractAddress, configuration.ERC20_ABI);
            
            switch(method) {
                case 'transfer' : {
                    if(!req.body.arguments.to) throw new InvalidInputError("to is required");
                    if(!req.body.arguments.amount) throw new InvalidInputError("amount is required");   
                    const {to, amount} = req.body.arguments;
                    const tx = await contract.transfer(to, amount);
                    await tx.wait();
                    console.log('Transaction hash:', tx.hash);

                    await connection.insert("erc20_transactions", {method, from : wallet.address, to, amount : amount.toString(), txHash : tx.hash});
                    return new CustomResponse(200, "Transfer successfull", null, {txHash : tx.hash, to , amount : amount.toString()});
                }

                case 'approve': {
                    if(!req.body.arguments.spender) throw new InvalidInputError("spender is required");
                    if(!req.body.arguments.value) throw new InvalidInputError("value is required");   
                    let {spender, value} = req.body.arguments;
                    value = ethers.parseEther(value);
                    const tx = await contract.approve(spender, value);
                    await tx.wait();
                    console.log('Transaction hash:', tx.hash);
                    await connection.insert("erc20_transactions", {method, from : wallet.address, spender, value : value.toString(), txHash : tx.hash});

                    return new CustomResponse(200, "Approved successfull", null, {txHash : tx.hash, spender, value : value.toString()});
                }

                default: 
                    console.log('default case');
                    return new CustomResponse(400, "This functionality is not supported yet", null, null);
            }
            
        } catch (error) {
            return CommonUtils.prepareErrorMessage(error);
        }

    }

    public async readContractERC721(req : any) : Promise<CustomResponse> {
        try {
            if(!req.body.method) throw new InvalidInputError("method is required");
            if(!req.body.contractAddress) throw new InvalidInputError("contractAddress is required");
            if(!req.body.network) throw new InvalidInputError("network is required");   

            const {method, contractAddress, network} = req.body;
            const configuration = configChain[network];
            if(!await this.isFunctionInABI(configuration.ERC721_ABI, method)) throw new InvalidInputError(`This method is not available for ERC721 token standard`);
            const contract : any = await this.initializeContract(configuration.JSON_RPC_PROVIDER, contractAddress, configuration.ERC721_ABI);
            
            switch(method) {
                case 'name' : {
                    const name = await contract.name();
                    console.log('name is ', name.toString());
                    return new CustomResponse(200, "Name of NFT fetched successfully", null, {name : name.toString()});
                }
                case 'tokenURI' : {
                    if(!req.body.arguments.tokenId) throw new InvalidInputError("tokenId is required");
                    const {tokenId} = req.body.arguments;
                    const tokenUri = await contract.tokenURI(tokenId);
                    console.log('tokenUri is ', tokenUri.toString());
                    return new CustomResponse(200, "tokenUri of NFT fetched successfully", null, {tokenUri});
                }
                default: 
                    console.log("default case");
                    return new CustomResponse(400, "This functionality is not supported yet", null, null);
            }
        } catch (error) {
            return CommonUtils.prepareErrorMessage(error);
        }
    }

    public async writeContractERC721(req: any) : Promise<CustomResponse> {
        const connection = new MongoUtils();
        connection.connect();
        try {
            if(!req.body.method) throw new InvalidInputError("method is required");
            if(!req.body.contractAddress) throw new InvalidInputError("contractAddress is required");
            if(!req.body.network) throw new InvalidInputError("network is required");   

            const {method, contractAddress, network} = req.body;
            const configuration = configChain[network];
            const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, new ethers.JsonRpcProvider(configuration.JSON_RPC_PROVIDER));

            if(! await this.isFunctionInABI(configuration.ERC721_ABI, method)) throw new InvalidInputError(`This method is not available for ERC721 token standard`)
            const contract : any = await this.initializeContract(configuration.JSON_RPC_PROVIDER, contractAddress, configuration.ERC721_ABI);
            
            switch(method) {
                case 'safeMint' : {
                    if(!req.body.arguments.uri) throw new InvalidInputError("uri is required");
                    if(!req.body.arguments.tokenId) throw new InvalidInputError("tokenId is required");
                    if(!req.body.arguments.to) throw new InvalidInputError("to address is required");
                    const {to, tokenId, uri} = req.body.arguments;
                    const tx = await contract.safeMint(to, tokenId, uri);
                    await tx.wait();
                    console.log('Transaction hash:', tx.hash);
                    await connection.insert("erc721_transactions", {method, from  : wallet.address, to, tokenId, uri, contractAddress, hash : tx.hash, network});
                    return new CustomResponse(200, "Minting successfull", null, {hash : tx.hash});
                }

                case 'safeTransferFrom' : {
                    if(!req.body.arguments.from) throw new InvalidInputError("from is required");
                    if(!req.body.arguments.tokenId) throw new InvalidInputError("tokenId is required");
                    if(!req.body.arguments.to) throw new InvalidInputError("to address is required");
                    const {to, tokenId, from} = req.body.arguments;

                    const tx = await contract.safeTransferFrom(from, to, tokenId);
                    await tx.wait();
                    console.log('Transaction hash:', tx.hash);
                    await connection.insert("erc721_transactions", {method, from  : wallet.address, to, tokenId, contractAddress, hash : tx.hash, network});
                    return new CustomResponse(200, "Transfer successfull", null, {hash : tx.hash});

                }

                case 'transferOwnership' : {
                    if(!req.body.arguments.newOwner) throw new InvalidInputError("newOwner is required");
                    const {newOwner} = req.body.arguments;
                    const tx = await contract.transferOwnership(newOwner);
                    await tx.wait();
                    console.log('Transaction hash:', tx.hash);
                    await connection.insert("erc721_transactions", {method, from  : wallet.address, newOwner, contractAddress, hash : tx.hash, network});
                    return new CustomResponse(200, "Ownership Transfered successfully", null, {hash : tx.hash});

                }

                default : 
                    console.log('default case');
                    return new CustomResponse(400, "This functionality is not supported yet", null, null);
            }
        } catch (error) {
            return CommonUtils.prepareErrorMessage(error);
        }
    }

    public async readContractERC1155(req : any) : Promise<CustomResponse> {
        try {
            if(!req.body.method) throw new InvalidInputError("method is required");
            if(!req.body.contractAddress) throw new InvalidInputError("contractAddress is required");
            if(!req.body.network) throw new InvalidInputError("network is required");   

            const {method, contractAddress, network} = req.body;
            const configuration = configChain[network];
            if(!await this.isFunctionInABI(configuration.ERC1155_ABI, method)) throw new InvalidInputError(`This method is not available for ERC1155 token standard`);
            const contract : any = await this.initializeContract(configuration.JSON_RPC_PROVIDER, contractAddress, configuration.ERC1155_ABI);
            
            switch(method) {
                case 'name' : {
                    const name = await contract.name();
                    console.log('name is ', name.toString());
                    return new CustomResponse(200, "Name of NFT fetched successfully", null, {name : name.toString()});
                }
                case 'uri' : {
                    if(!req.body.arguments.tokenId) throw new InvalidInputError("tokenId is required");
                    const {tokenId} = req.body.arguments;
                    const uri = await contract.uri(tokenId);
                    console.log('uri is ', uri.toString());
                    return new CustomResponse(200, "tokenUri of NFT fetched successfully", null, {uri});
                }
                case 'balanceOf' : {
                    if(!req.body.arguments.account) throw new InvalidInputError("account is required");
                    if(!req.body.arguments.id) throw new InvalidInputError("id is required");
                    const {account, id} = req.body.arguments;
                    const balance = await contract.balanceOf(account, id);
                    console.log('balance is ', balance.toString());
                    return new CustomResponse(200, "balance of NFT fetched successfully", null, {balance: parseInt(balance)});
                }
                default: 
                    console.log("default case");
                    return new CustomResponse(400, "This functionality is not supported yet", null, null);
            }
        } catch (error) {
            return CommonUtils.prepareErrorMessage(error);
        }
    }

    public async writeContractERC1155(req: any) : Promise<CustomResponse> {
        const connection = new MongoUtils();
        connection.connect();
        try {
            if(!req.body.method) throw new InvalidInputError("method is required");
            if(!req.body.contractAddress) throw new InvalidInputError("contractAddress is required");
            if(!req.body.network) throw new InvalidInputError("network is required");   

            const {method, contractAddress, network} = req.body;
            const configuration = configChain[network];
            const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, new ethers.JsonRpcProvider(configuration.JSON_RPC_PROVIDER));

            if(! await this.isFunctionInABI(configuration.ERC1155_ABI, method)) throw new InvalidInputError(`This method is not available for ERC1155 token standard`)
            const contract : any = await this.initializeContract(configuration.JSON_RPC_PROVIDER, contractAddress, configuration.ERC1155_ABI);
            
            switch(method) {
                case 'mint' : {
                    if(!req.body.arguments.account) throw new InvalidInputError("account is required");
                    if(!req.body.arguments.amount) throw new InvalidInputError("amount is required");
                    if(!req.body.arguments.tokenURI) throw new InvalidInputError("tokenURI address is required");
                    if(!req.body.arguments.data) throw new InvalidInputError("data address is required");

                    const {account, amount, tokenURI, data} = req.body.arguments;
                    const tx = await contract.mint(account, amount, tokenURI, data);
                    await tx.wait();
                    console.log('Transaction hash:', tx.hash);
                    await connection.insert("erc1155_transactions", {method, from  : wallet.address, account, tokenURI, amount, contractAddress, hash : tx.hash, network});
                    return new CustomResponse(200, "Minting successfull", null, {txHash : tx.hash});
                }

                case 'safeTransferFrom' : {
                    if(!req.body.arguments.from) throw new InvalidInputError("from is required");
                    if(!req.body.arguments.id) throw new InvalidInputError("id is required");
                    if(!req.body.arguments.to) throw new InvalidInputError("to address is required");
                    if(!req.body.arguments.value) throw new InvalidInputError("value address is required");
                    if(!req.body.arguments.data) throw new InvalidInputError("data address is required");

                    const {from, to, id, value, data} = req.body.arguments;

                    const tx = await contract.safeTransferFrom(from, to, id, value, data);
                    await tx.wait();
                    console.log('Transaction hash:', tx.hash);
                    await connection.insert("erc1155_transactions", {method, from  : wallet.address, to, tokenId: id, amount : value, contractAddress, hash : tx.hash, network});
                    return new CustomResponse(200, "Transfer successfull", null, {txHash : tx.hash});

                }

                case 'transferOwnership' : {
                    if(!req.body.arguments.newOwner) throw new InvalidInputError("newOwner is required");
                    const {newOwner} = req.body.arguments;
                    const tx = await contract.transferOwnership(newOwner);
                    await tx.wait();
                    console.log('Transaction hash:', tx.hash);
                    await connection.insert("erc1155_transactions", {method, from  : wallet.address, newOwner, contractAddress, hash : tx.hash, network});
                    return new CustomResponse(200, "Ownership Transfered successfully", null, {hash : tx.hash});

                }

                case 'mintBatch' : {
                    if(!req.body.arguments.ids) throw new InvalidInputError("ids is required");
                    if(!req.body.arguments.amounts) throw new InvalidInputError("amounts is required");
                    if(!req.body.arguments.to) throw new InvalidInputError("to address is required");
                    if(!req.body.arguments.data) throw new InvalidInputError("data address is required");
                    const {to, ids, amounts, data} = req.body.arguments;

                    const tx = await contract.mintBatch(to, ids, amounts, data);
                    await tx.wait();
                    console.log('Transaction hash:', tx.hash);
                    await connection.insert("erc1155_transactions", {method, from  : wallet.address, to, tokenIds: ids, amounts, contractAddress, hash : tx.hash, network});
                    return new CustomResponse(200, "Batch Minting done successfully", null, {hash : tx.hash});   
                }

                case 'safeBatchTransferFrom' : {
                    if(!req.body.arguments.ids) throw new InvalidInputError("ids is required");
                    if(!req.body.arguments.values) throw new InvalidInputError("values is required");
                    if(!req.body.arguments.to) throw new InvalidInputError("to address is required");
                    if(!req.body.arguments.from) throw new InvalidInputError("from address is required");
                    if(!req.body.arguments.data) throw new InvalidInputError("data address is required");

                    const {from, to, ids, values, data} = req.body.arguments;
                    const tx = await contract.safeBatchTransferFrom(from, to, ids, values, data);
                    await tx.wait();
                    console.log('Transaction hash:', tx.hash);
                    await connection.insert("erc1155_transactions", {method, from  : wallet.address, to, tokenIds: ids, amounts: values, contractAddress, hash : tx.hash, network});
                    return new CustomResponse(200, "Batch Transfer done successfully", null, {hash : tx.hash});   
                }

                default : 
                    console.log('default case');
                    return new CustomResponse(400, "This functionality is not supported yet", null, null);
            }
        } catch (error) {
            return CommonUtils.prepareErrorMessage(error);
        }
    }
}

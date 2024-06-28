import { InvalidInputError } from "../errors/invalid-input.error";
import { CustomResponse } from "../models/custom-response.model";
import { LoyyalTokenTransfer } from "../models/loyyal-token-transfer.model";
import { CommonUtils } from "../utils/common.utils";
import { MongoUtils } from "../utils/mongo.utils";
import { Network, Alchemy } from "alchemy-sdk";
import { ethers, run , network, config} from "hardhat";
import hre from "hardhat"
import axios from "axios";

import { ERC721_POLYGON_TESTNET_ABI} from "../../config/config";
import { configChain } from "../../config/config-chain"
import { NotificationService } from "./notification.service";
import path from "path";
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

    public async deployERC20Contract(req : any) : Promise<CustomResponse> {
        const connection = new MongoUtils();
        connection.connect();

        try {
            if(!req.body.name) throw new InvalidInputError("name is required");
            if(!req.body.symbol) throw new InvalidInputError("symbol is required");
            if(!req.body.initialSupply) throw new InvalidInputError("initialSuppply is required");
            if(!req.body.decimals) throw new InvalidInputError("decimals is required");
            if(!req.body.tokenStandard) throw new InvalidInputError("tokenStandard is required");
            if(!req.body.mintable) throw new InvalidInputError("mintable is required");
            if(!req.body.network) throw new InvalidInputError("network is required");   
            const { name, symbol, initialSupply, decimals, network, tokenStandard } = req.body;
            if(!configChain.chains.includes(network)) throw new InvalidInputError(`${network} network is not supported yet`);
            const configuration = configChain[network];

            console.log(`-------------Deployment of ${tokenStandard} contract started on ${network}--------------- `);
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
    
    public async deployERC721Contract(req : any) {
        const connection = new MongoUtils();
        connection.connect();
        try {
            if(!req.body.name) throw new InvalidInputError("name is required");
            if(!req.body.symbol) throw new InvalidInputError("symbol is required");
            if(!req.body.network) throw new InvalidInputError("network is required");   
            if(!req.body.tokenStandard) throw new InvalidInputError("tokenStandard is required");


            const { name, symbol, network, tokenStandard } = req.body;
            const configuration = configChain[network];
            console.log(`-------------Deployment of ${tokenStandard} contract started on ${network}--------------- `);

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

        } catch (error) {
            return CommonUtils.prepareErrorMessage(error);
        }
    }

    public async mintERC721Nft(req : any) : Promise<CustomResponse>{
        const connection = new MongoUtils();
        connection.connect();
        try {
            const to = req.body.to;
            const tokenId = req.body.tokenId;
            const uri = req.body.uri;
            const contractAddress = req.body.contractAddress;
            const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, new ethers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER_AMOY));
            
            const contract : any = await this.initializeContract(process.env.JSON_RPC_PROVIDER_AMOY, contractAddress, ERC721_POLYGON_TESTNET_ABI);
            const tx = await contract.safeMint(to, tokenId, uri);
            await tx.wait();
            console.log('Transaction hash:', tx.hash);
            await connection.insert("erc721_transactions", {method : 'safeMint', from  : wallet.address, to, tokenId, uri, contractAddress, hash : tx.hash});
            return new CustomResponse(200, "Minting successfull", null, {hash : tx.hash});

        } catch (error) {
            return CommonUtils.prepareErrorMessage(error);

        }
    }

    public async transfer(req : any) : Promise<CustomResponse> {

        try {
            if(!req.body.to) throw new InvalidInputError("to address is required");
            if(!req.body.amount) throw new InvalidInputError("amount is required");
            if(!req.body.contractAddress) throw new InvalidInputError("contractAddress is required");
            if(!req.body.network) throw new InvalidInputError("network is required");   

            const connection = new MongoUtils();
            connection.connect();
    
            const to = req.body.to;
            const amount = ethers.parseUnits(req.body.amount, 18);
            const contractAddress = req.body.contractAddress;
            const network = req.body.network;
            const configuration = configChain[network];
            const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, new ethers.JsonRpcProvider(configuration.JSON_RPC_PROVIDER));
            const contract : any = await this.initializeContract(configuration.JSON_RPC_PROVIDER, contractAddress, configuration.ERC20_ABI);
            const tx = await contract.transfer(to, amount);
            await tx.wait();
            console.log('Transaction hash:', tx.hash);

            let tokenTransfer = new LoyyalTokenTransfer();
            tokenTransfer.$identifier = CommonUtils.generateUniqueUUID();
            tokenTransfer.$from = wallet.address;
            tokenTransfer.$to = to;
            tokenTransfer.$txHash = tx.hash;
            tokenTransfer.$amount = amount.toString();
            tokenTransfer.$network = network;

            await connection.insert("erc20_transactions", tokenTransfer);
            return new CustomResponse(200, "Transfer successfull", null, {hash : tx.hash, checkOnExplorer: `${configuration.EXPLORER_BASE_URL}/tx/${tx.hash}`});
    
        } catch (error) {
            return CommonUtils.prepareErrorMessage(error);
        }
    }

    public async getTotalSupply(req : any) : Promise<CustomResponse> {
        try {
            if(!req.body.contractAddress) throw new InvalidInputError("contractAddress is required");
            if(!req.body.network) throw new InvalidInputError("network is required");   
    
            const connection = new MongoUtils();
            connection.connect();
            const network = req.body.network;
            const contractAddress = req.body.contractAddress;
            const configuration = configChain[network];
            const contract : any = await this.initializeContract(configuration.JSON_RPC_PROVIDER, contractAddress, configuration.ERC20_ABI);
            const totalSupply = await contract.totalSupply();
            console.log('totalSupply is ', totalSupply.toString(), ' wei');
    
            return new CustomResponse(200, "Transfer successfull", null, {totalSupply : totalSupply.toString()});
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

    public async readContract(req : any) {
        try {
            if(!req.body.method) throw new InvalidInputError("method is required");
            if(!req.body.contractAddress) throw new InvalidInputError("contractAddress is required");
            if(!req.body.network) throw new InvalidInputError("network is required");   

            const {method, contractAddress, network} = req.body;
            const configuration = configChain[network];
            if(!await this.isFunctionInABI(configuration.ERC20_ABI, method)) throw new InvalidInputError(`${method} is not available for ERC20 token standard`);
            const contract : any = await this.initializeContract(configuration.JSON_RPC_PROVIDER, contractAddress, configuration.ERC20_ABI);
            
            switch(method) {
                case 'totalSupply' : {
                    const totalSupply = await contract.totalSupply();
                    console.log('totalSupply is ', totalSupply.toString(), ' wei');
                    return new CustomResponse(200, "Total supply fetched successfully", null, {totalSupply : totalSupply.toString()});
                }
                default: 
                    console.log("default casse");
                    break;
            }
        } catch (error) {
            return CommonUtils.prepareErrorMessage(error);
        }
    }

    public async writeContract(req: any) {
        try {
            if(!req.body.method) throw new InvalidInputError("method is required");
            if(!req.body.contractAddress) throw new InvalidInputError("contractAddress is required");
            if(!req.body.to) throw new InvalidInputError("to address is required");
            if(!req.body.amount) throw new InvalidInputError("amount is required");
            if(!req.body.network) throw new InvalidInputError("network is required");   

            const {method, contractAddress, network} = req.body;
            const configuration = configChain[network];
            if(! await this.isFunctionInABI(configuration.ERC20_ABI, method)) throw new InvalidInputError(`${method} is not available for ERC20 token standard`)
            const contract : any = await this.initializeContract(configuration.JSON_RPC_PROVIDER, contractAddress, configuration.ERC20_ABI);
            
            switch(method) {
                case 'transfer' : {
                    const {to, amount} = req.body;
                    const tx = await contract.transfer(to, amount);
                    await tx.wait();
                    console.log('Transaction hash:', tx.hash);
                    return new CustomResponse(200, "Transfer successfull", null, {txHash : tx.hash});
                }
            }
            
        } catch (error) {
            return CommonUtils.prepareErrorMessage(error);
        }

    }


}

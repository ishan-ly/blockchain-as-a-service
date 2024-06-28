import { InvalidInputError } from "../errors/invalid-input.error";
import { CustomResponse } from "../models/custom-response.model";
import { LoyyalTokenTransfer } from "../models/loyyal-token-transfer.model";
import { CommonUtils } from "../utils/common.utils";
import { MongoUtils } from "../utils/mongo.utils";
import { ethers, run } from "hardhat";

export class TokenService {
    private async initializeContract(JSON_RPC_PROVIDER, contractAddress, ABI) {
        try {
            const provider = new ethers.JsonRpcProvider(JSON_RPC_PROVIDER);
            const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
            return new ethers.Contract(contractAddress, ABI, wallet);
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
            const configuration = config[network];
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
            const configuration = config[network];
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

}
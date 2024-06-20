import { InvalidInputError } from "../errors/invalid-input.error";
import { CustomResponse } from "../models/custom-response.model";
import { LoyyalTokenTransfer } from "../models/loyyal-token-transfer.model";
import { CommonUtils } from "../utils/common.utils";
import { MongoUtils } from "../utils/mongo.utils";
import { Network, Alchemy } from "alchemy-sdk";
import { ethers } from "ethers";
import { ERC20_POLYGON_TESTNET_CONTRACT_ADDRESS,  ERC20_POLYGON_TESTNET_ABI} from "../../config/config";
import { NotificationService } from "./notification.service";

export class BlockchainService {
    JSON_RPC_PROVIDER : any = process.env.JSON_RPC_PROVIDER

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

    private async initializeContract(wallet) {
        try {
            return new ethers.Contract(ERC20_POLYGON_TESTNET_CONTRACT_ADDRESS, ERC20_POLYGON_TESTNET_ABI, wallet);
        } catch (error) {
            return CommonUtils.prepareErrorMessage(error);
        }       
    }

    public async transfer(req : any) : Promise<CustomResponse> {

        try {
            if(!req.body.to) throw new InvalidInputError("to address is required");
            if(!req.body.amount) throw new InvalidInputError("amount is required");

            const connection = new MongoUtils();
            connection.connect();
    
            const to = req.body.to;
            const amount = ethers.parseUnits(req.body.amount, 18);

            const provider = new ethers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
            const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
            const contract : any = await this.initializeContract(wallet);
            const tx = await contract.transfer(to, amount);
            await tx.wait();
            console.log('Transaction hash:', tx.hash);

            let tokenTransfer = new LoyyalTokenTransfer();
            tokenTransfer.$identifier = CommonUtils.generateUniqueUUID();
            tokenTransfer.$from = wallet.address;
            tokenTransfer.$to = to;
            tokenTransfer.$txHash = tx.hash;
            tokenTransfer.$amount = amount.toString();
            tokenTransfer.$network = process.env.NETWORK;

            await connection.insert("loyyal_token_transfers", tokenTransfer);
            return new CustomResponse(200, "Transfer successfull", null, {hash : tx.hash});
    
        } catch (error) {
            return CommonUtils.prepareErrorMessage(error);
        }
    }

    public async getAllTransferTransactions() : Promise<CustomResponse> {
        try {
            const connection = new MongoUtils();
            connection.connect();
            const data = await connection.filter("loyyal_token_transfers",{}, null);

            let tokenTransfer = data.map((x) => ( new LoyyalTokenTransfer(x))) 
            return new CustomResponse(200, "List of transfer transactions of Loyyal token", null, tokenTransfer);
        } catch (error) {
            return CommonUtils.prepareErrorMessage(error);
        }
    }
}

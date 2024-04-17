import { InvalidInputError } from "../errors/invalid-input.error";
import { CustomResponse } from "../models/custom-response.model";
import { CommonUtils } from "../utils/common.utils";
import { MongoUtils } from "../utils/mongo.utils";
import { EmailService } from "./email.service";
import { Network, Alchemy } from "alchemy-sdk";

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
            await new EmailService().sentNFTAirdrops(request.emailAddress, request.name, request.nftImageUrl, request.nftContractAddress, `${request.explorerBaseUrl}/address/${request.nftContractAddress}#code`)

            const response: CustomResponse = new CustomResponse(200, "airdrop details successfully added", null, null)
            return response;
        } catch (error) {
            return CommonUtils.prepareErrorMessage(error);
        } finally {
            connection.disconnect();
        }
    }

}
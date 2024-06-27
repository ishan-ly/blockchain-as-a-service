import * as express from 'express';
import { BlockchainService } from '../services/blockchain.service';

export default function blockchainServiceController(app: express.Application) {
    app.post('/v1/nft/save-airdorp-details', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().submitNFTAirdopDetails(req.body);
        return res.status(response.status).send(response);
    });

    app.get('/v1/nft/get-nfts-details', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().getNFTsByAddress();
        return res.status(response.status).send(response);
    });

    app.post('/v1/token/transfer', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().transfer(req);
        return res.status(response.status).send(response);
    });

    app.get('/v1/token/transactions', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().getAllTransferTransactions();
        return res.status(response.status).send(response);
    });

    app.post('/v1/token/deploy-contract', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().deployERC20Contract(req);
        return res.status(response.status).send(response);
    });

    app.post('/v1/token/deploy-contract-erc721', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().deployERC721Contract(req);
        return res.status(response.status).send(response);
    });

    app.post('/v1/token/mint-erc721', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().mintERC721Nft(req);
        return res.status(response.status).send(response);
    });

    app.get('/v1/token/verify', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().verifyContract1(req);
        return res.status(response.status).send(response);
    });



}

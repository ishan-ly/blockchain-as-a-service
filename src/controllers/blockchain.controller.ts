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

    app.get('/v1/token/verify', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().verifyContract1(req);
        return res.status(response.status).send(response);
    });

    app.post('/v1/token/erc20/read-contract', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().readContractERC20(req);
        return res.status(response.status).send(response);
    });

    app.post('/v1/token/erc20/write-contract', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().writeContractERC20(req);
        return res.status(response.status).send(response);
    });

    app.post('/v1/token/erc721/read-contract', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().readContractERC721(req);
        return res.status(response.status).send(response);
    });

    app.post('/v1/token/erc721/write-contract', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().writeContractERC721(req);
        return res.status(response.status).send(response);
    });



}

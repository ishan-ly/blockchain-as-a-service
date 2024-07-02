import * as express from 'express';
import blockchainServiceController from './blockchain.controller';

export default function entryPoint(app: express.Application) {

    // app.get('/', async function (req: express.Request, res: express.Response) {
    //     let response: any = { status: 200, message: 'Welcome to Partner Hub API', body: { version: '2.2.0', vendor: { name: 'Loyyal Holdings' } } };
    //     return res.status(200).send(response);
    // });
    
    app.get('/logs/health-check', async function (req: express.Request, res: express.Response) {
        let response: any = { status: 200, message: 'Welcome to Partner Hub API', body: { version: '2.2.0', vendor: { name: 'Loyyal Holdings' } } };
        return res.status(200).send(response);
    });

    blockchainServiceController(app)
}
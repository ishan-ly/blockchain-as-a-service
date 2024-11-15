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

    /**
     * @swagger
     * /v1/token/deploy-contract:
     *   post:
     *     tags:
     *       - Deploy
     *     summary: Deploy a token contract
     *     description: Deploy an ERC20, ERC721 and ERC1155 token contract on the specified network. Currently we support polygonAmoy and sepolia networks.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               tokenStandard:
     *                 type: string
     *                 enum: [ERC20, ERC721, ERC1155]
     *               network:
     *                 type: string
     *                 example: polygonAmoy
     *               arguments:
     *                 type: object
     *                 properties:
     *                   name:
     *                     type: string
     *                     example: Loyyal Token0708
     *                   symbol:
     *                     type: string
     *                     example: LOY08
     *                   initialSupply:
     *                     type: integer
     *                     example: 1000000
     *                   decimals:
     *                     type: integer
     *                     example: 18
     *                   mintable:
     *                     type: boolean
     *                     example: true
     *           examples:
     *             ERC20:
     *               summary: Example for deploying an ERC20 contract
     *               value:
     *                 tokenStandard: ERC20
     *                 network: polygonAmoy
     *                 arguments:
     *                   name: Loyyal Token0708
     *                   symbol: LOY08
     *                   initialSupply: 1000000
     *                   decimals: 18
     *                   mintable: true
     *             ERC721:
     *               summary: Example for deploying an ERC721 contract
     *               value:
     *                 tokenStandard: ERC721
     *                 network: polygonAmoy
     *                 arguments:
     *                   name: Loyyal Token0708
     *                   symbol: LOY08
     *             ERC1155:
     *               summary: Example for deploying an ERC1155 contract
     *               value:
     *                 tokenStandard: ERC1155
     *                 network: sepolia
     *                 arguments:
     *                   name: Loyyal Token1016
     *                   symbol: LOY1016
     *     responses:
     *       200:
     *         description: Contract deployed successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: integer
     *                   example: 200
     *                 message:
     *                   type: string
     *                   example: Contract deployed successfully
     *                 error:
     *                   type: string
     *                   nullable: true
     *                   example: null
     *                 body:
     *                   type: object
     *                   properties:
     *                     tokenAddress:
     *                       type: string
     *                       example: 0x7dA54B7AaaC132586DEe7cA6be2Fdb8c1de01921
     *                     txHash:
     *                       type: string
     *                       example: 0xdd58b9393f8f62b616913cb3659fa959703516fa494339b89dc58c45619545d6
     *                     creatorAddress:
     *                       type: string
     *                       example: 0xe8F910b8eD19BC258b20A0c86e292394EfE38318
     *                     explorerUrl:
     *                       type: string
     *                       example: https://amoy.polygonscan.com/token/0x7dA54B7AaaC132586DEe7cA6be2Fdb8c1de01921
     *                     network:
     *                       type: string
     *                       example: polygonAmoy
     *             examples:
     *               ERC20:
     *                 summary: Example response for deploying an ERC20 contract
     *                 value:
     *                   status: 200
     *                   message: Contract deployed successfully
     *                   error: null
     *                   body:
     *                     tokenAddress: "0x7dA54B7AaaC132586DEe7cA6be2Fdb8c1de01921"
     *                     txHash: "0xdd58b9393f8f62b616913cb3659fa959703516fa494339b89dc58c45619545d6"
     *                     creatorAddress: "0xe8F910b8eD19BC258b20A0c86e292394EfE38318"
     *                     explorerUrl: "https://amoy.polygonscan.com/token/0x7dA54B7AaaC132586DEe7cA6be2Fdb8c1de01921"
     *                     network: "polygonAmoy"
     *               ERC721:
     *                 summary: Example response for deploying an ERC721 contract
     *                 value:
     *                   status: 200
     *                   message: Contract ERC721 deployed successfully
     *                   error: null
     *                   body:
     *                     tokenAddress: "0x3d13225F3ed4b0F220e5831fb88528c6d78204Bd"
     *                     txHash: "0x2de5514a1a172e6509c6502d4c7595528f20683a86c9269033c2c11d40a81021"
     *                     creatorAddress: "0xe8F910b8eD19BC258b20A0c86e292394EfE38318"
     *                     explorerUrl: "https://amoy.polygonscan.com/token/0x3d13225F3ed4b0F220e5831fb88528c6d78204Bd"
     *                     network: "polygonAmoy"
     *               ERC1155:
     *                 summary: Example response for deploying an ERC1155 contract
     *                 value:
     *                   status: 200
     *                   message: Contract ERC1155 deployed successfully
     *                   error: null
     *                   body:
     *                     tokenAddress: "0x6eE634B23DD7366ff25D6f2f5a15767a3d6cB028"
     *                     txHash: "0xd186462722ca34bb573207b67f49139b7a81f4ed80e2f9069f075aedc1e17d99"
     *                     creatorAddress: "0xe8F910b8eD19BC258b20A0c86e292394EfE38318"
     *                     explorerUrl: "https://sepolia.etherscan.io/token/0x6eE634B23DD7366ff25D6f2f5a15767a3d6cB028"
     *                     network: "sepolia"
     */
    app.post('/v1/token/deploy-contract', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().deployContract(req);
        return res.status(response.status).send(response);
    });

    app.get('/v1/token/verify', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().verifyContract1(req);
        return res.status(response.status).send(response);
    });

    /**
     * @swagger
     * /v1/token/erc20/read-contract:
     *   post:
     *     tags:
     *       - ERC20
     *     summary: Read data from an ERC20 token contract
     *     description: Interact with an ERC20 contract to read various properties such as balance, name, symbol, owner, and total supply.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               tokenStandard:
     *                 type: string
     *                 example: ERC20
     *               method:
     *                 type: string
     *                 enum: [balanceOf, name, symbol, owner, totalSupply]
     *               network:
     *                 type: string
     *                 example: polygonAmoy
     *               contractAddress:
     *                 type: string
     *                 example: 0xf9f69b668E6d03098360B8b854bc91A48d7D83d7
     *               arguments:
     *                 type: object
     *                 properties:
     *                   accountAddress:
     *                     type: string
     *                     example: 0xe8F910b8eD19BC258b20A0c86e292394EfE38318
     *           examples:
     *             balanceOf:
     *               summary: Example for balanceOf method
     *               value:
     *                 tokenStandard: ERC20
     *                 method: balanceOf
     *                 network: polygonAmoy
     *                 contractAddress: 0xf9f69b668E6d03098360B8b854bc91A48d7D83d7
     *                 arguments:
     *                   accountAddress: 0xe8F910b8eD19BC258b20A0c86e292394EfE38318
     *             name:
     *               summary: Example for name method
     *               value:
     *                 tokenStandard: ERC20
     *                 method: name
     *                 network: polygonAmoy
     *                 contractAddress: 0xf9f69b668E6d03098360B8b854bc91A48d7D83d7
     *             symbol:
     *               summary: Example for symbol method
     *               value:
     *                 tokenStandard: ERC20
     *                 method: symbol
     *                 network: polygonAmoy
     *                 contractAddress: 0xf9f69b668E6d03098360B8b854bc91A48d7D83d7
     *             owner:
     *               summary: Example for owner method
     *               value:
     *                 tokenStandard: ERC20
     *                 method: owner
     *                 network: polygonAmoy
     *                 contractAddress: 0xf9f69b668E6d03098360B8b854bc91A48d7D83d7
     *             totalSupply:
     *               summary: Example for totalSupply method
     *               value:
     *                 tokenStandard: ERC20
     *                 method: totalSupply
     *                 network: polygonAmoy
     *                 contractAddress: 0xf9f69b668E6d03098360B8b854bc91A48d7D83d7
     *     responses:
     *       200:
     *         description: Contract read successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: integer
     *                   example: 200
     *                 message:
     *                   type: string
     *                   example: Contract read successfully
     *                 error:
     *                   type: string
     *                   nullable: true
     *                   example: null
     *                 body:
     *                   type: object
     *                   properties:
     *                     result:
     *                       type: string
     *                       example: '1234567890' 
     *             examples:
     *               balanceOf:
     *                 summary: Example response for balanceOf method
     *                 value:
     *                   status: 200
     *                   message: "Balance fetched successfully"
     *                   error: null
     *                   body:
     *                     balance: "1000000000000000000000000"
     *               name:
     *                 summary: Example response for name method
     *                 value:
     *                   status: 200
     *                   message: "Name fetched successfully"
     *                   error: null
     *                   body:
     *                     name: "Loyyal Token"
     *               symbol:
     *                 summary: Example response for symbol method
     *                 value:
     *                   status: 200
     *                   message: "Symbol fetched successfully"
     *                   error: null
     *                   body:
     *                     symbol: "LOY"
     *               owner:
     *                 summary: Example response for owner method
     *                 value:
     *                   status: 200
     *                   message: "Owner fetched successfully"
     *                   error: null
     *                   body:
     *                     owner: "0xe8F910b8eD19BC258b20A0c86e292394EfE38318"
     *               totalSupply:
     *                 summary: Example response for totalSupply method
     *                 value:
     *                   status: 200
     *                   message: "Total supply fetched successfully"
     *                   error: null
     *                   body:
     *                     totalSupply: "1000000000000000000000000"
     */
    app.post('/v1/token/erc20/read-contract', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().readContractERC20(req);
        return res.status(response.status).send(response);
    });

    /**
     * @swagger
     * /v1/token/erc20/write-contract:
     *   post:
     *     tags:
     *       - ERC20
     *     summary: Write to an ERC20 token contract
     *     description: Perform write operations (e.g., transfer, approve) on an ERC20 token contract.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               tokenStandard:
     *                 type: string
     *                 enum: [ERC20]
     *               method:
     *                 type: string
     *                 enum: [transfer, approve]
     *               network:
     *                 type: string
     *                 example: polygonAmoy
     *               contractAddress:
     *                 type: string
     *                 example: 0xf9f69b668E6d03098360B8b854bc91A48d7D83d7
     *               arguments:
     *                 type: object
     *                 properties:
     *                   to:
     *                     type: string
     *                     example: 0x308524c70C885521872F3D5C981a8fC650e256FE
     *                   amount:
     *                     type: string
     *                     example: "10"
     *                   spender:
     *                     type: string
     *                     example: 0x308524c70C885521872F3D5C981a8fC650e256FE
     *                   value:
     *                     type: string
     *                     example: "10"
     *           examples:
     *             transfer:
     *               summary: Example for transferring ERC20 tokens
     *               value:
     *                 tokenStandard: ERC20
     *                 method: transfer
     *                 network: polygonAmoy
     *                 contractAddress: 0xf9f69b668E6d03098360B8b854bc91A48d7D83d7
     *                 arguments:
     *                   to: 0x308524c70C885521872F3D5C981a8fC650e256FE
     *                   amount: "10"
     *             approve:
     *               summary: Example for approving ERC20 token transfer
     *               value:
     *                 tokenStandard: ERC20
     *                 method: approve
     *                 network: polygonAmoy
     *                 contractAddress: 0xf9f69b668E6d03098360B8b854bc91A48d7D83d7
     *                 arguments:
     *                   spender: 0x308524c70C885521872F3D5C981a8fC650e256FE
     *                   value: "10"
     *     responses:
     *       200:
     *         description: Operation successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: integer
     *                   example: 200
     *                 message:
     *                   type: string
     *                   example: Transfer successful
     *                 error:
     *                   type: string
     *                   nullable: true
     *                   example: null
     *                 body:
     *                   type: object
     *                   properties:
     *                     txHash:
     *                       type: string
     *                       example: 0xdad5c96e71664af77867e26cea62606bb2d34fa4729641c0d5b0f62e2316bf70
     *                     to:
     *                       type: string
     *                       example: 0x308524c70C885521872F3D5C981a8fC650e256FE
     *                     amount:
     *                       type: string
     *                       example: "10"
     *             examples:
     *               transfer:
     *                 summary: Example response for transferring ERC20 tokens
     *                 value:
     *                   status: 200
     *                   message: Transfer successful
     *                   error: null
     *                   body:
     *                     txHash: "0xdad5c96e71664af77867e26cea62606bb2d34fa4729641c0d5b0f62e2316bf70"
     *                     to: "0x308524c70C885521872F3D5C981a8fC650e256FE"
     *                     amount: "10"
     *               approve:
     *                 summary: Example response for approving ERC20 token transfer
     *                 value:
     *                   status: 200
     *                   message: Approved successful
     *                   error: null
     *                   body:
     *                     txHash: "0xc39123a3d68585dc6c8058019c210538eb6e8b11fe100698c3a777fcedadf050"
     *                     spender: "0x308524c70C885521872F3D5C981a8fC650e256FE"
     *                     value: "10000000000000000000"
     */
    app.post('/v1/token/erc20/write-contract', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().writeContractERC20(req);
        return res.status(response.status).send(response);
    });

    /**
     * @swagger
     * /v1/token/erc721/read-contract:
     *   post:
     *     tags:
     *       - ERC721
     *     summary: Read data from an ERC721 token contract
     *     description: Perform read operations (e.g., name, tokenURI) on an ERC721 token contract.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               tokenStandard:
     *                 type: string
     *                 enum: [ERC721]
     *               method:
     *                 type: string
     *                 enum: [name, tokenURI]
     *               network:
     *                 type: string
     *                 example: polygonAmoy
     *               contractAddress:
     *                 type: string
     *                 example: 0x1675d34312202ae0221e27D9327885C31af4A685
     *               arguments:
     *                 type: object
     *                 properties:
     *                   tokenId:
     *                     type: integer
     *                     example: 1
     *           examples:
     *             name:
     *               summary: Example for fetching ERC721 token name
     *               value:
     *                 tokenStandard: ERC721
     *                 method: name
     *                 network: polygonAmoy
     *                 contractAddress: 0x1675d34312202ae0221e27D9327885C31af4A685
     *             tokenURI:
     *               summary: Example for fetching ERC721 token URI
     *               value:
     *                 tokenStandard: ERC721
     *                 method: tokenURI
     *                 network: polygonAmoy
     *                 contractAddress: 0x82E1578dC4568e69C55340Ea3240e864dd9E0EB5
     *                 arguments:
     *                   tokenId: 1
     *     responses:
     *       200:
     *         description: Operation successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: integer
     *                   example: 200
     *                 message:
     *                   type: string
     *                   example: Name of NFT fetched successfully
     *                 error:
     *                   type: string
     *                   nullable: true
     *                   example: null
     *                 body:
     *                   type: object
     *                   properties:
     *                     name:
     *                       type: string
     *                       example: Loyyal Token14
     *                     tokenUri:
     *                       type: string
     *                       example: https://silver-recent-marlin-593.mypinata.cloud/ipfs/QmY2pSmHAVVJnsVbeE3Gnqfr94ppezgixVVvWZtguCRXa3
     *             examples:
     *               name:
     *                 summary: Example response for fetching ERC721 token name
     *                 value:
     *                   status: 200
     *                   message: Name of NFT fetched successfully
     *                   error: null
     *                   body:
     *                     name: Loyyal Token14
     *               tokenURI:
     *                 summary: Example response for fetching ERC721 token URI
     *                 value:
     *                   status: 200
     *                   message: tokenUri of NFT fetched successfully
     *                   error: null
     *                   body:
     *                     tokenUri: https://silver-recent-marlin-593.mypinata.cloud/ipfs/QmY2pSmHAVVJnsVbeE3Gnqfr94ppezgixVVvWZtguCRXa3
     */
    app.post('/v1/token/erc721/read-contract', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().readContractERC721(req);
        return res.status(response.status).send(response);
    });

    /**
     * @swagger
     * /v1/token/erc721/write-contract:
     *   post:
     *     tags:
     *       - ERC721
     *     summary: Write to an ERC721 token contract
     *     description: Perform write operations (e.g., safeMint, safeTransferFrom, transferOwnership) on an ERC721 token contract.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               tokenStandard:
     *                 type: string
     *                 enum: [ERC721]
     *               method:
     *                 type: string
     *                 enum: [safeMint, safeTransferFrom, transferOwnership]
     *               network:
     *                 type: string
     *                 example: polygonAmoy
     *               contractAddress:
     *                 type: string
     *                 example: 0x82E1578dC4568e69C55340Ea3240e864dd9E0EB5
     *               arguments:
     *                 type: object
     *                 properties:
     *                   to:
     *                     type: string
     *                     example: 0xe8F910b8eD19BC258b20A0c86e292394EfE38318
     *                   tokenId:
     *                     type: integer
     *                     example: 2
     *                   uri:
     *                     type: string
     *                     example: https://silver-recent-marlin-593.mypinata.cloud/ipfs/QmY2pSmHAVVJnsVbeE3Gnqfr94ppezgixVVvWZtguCRXa3
     *                   from:
     *                     type: string
     *                     example: 0xe8F910b8eD19BC258b20A0c86e292394EfE38318
     *                   newOwner:
     *                     type: string
     *                     example: 0x308524c70C885521872F3D5C981a8fC650e256FE
     *           examples:
     *             safeMint:
     *               summary: Example for safeMint operation on ERC721 contract
     *               value:
     *                 tokenStandard: ERC721
     *                 method: safeMint
     *                 network: polygonAmoy
     *                 contractAddress: 0x82E1578dC4568e69C55340Ea3240e864dd9E0EB5
     *                 arguments:
     *                   to: 0xe8F910b8eD19BC258b20A0c86e292394EfE38318
     *                   tokenId: 2
     *                   uri: https://silver-recent-marlin-593.mypinata.cloud/ipfs/QmY2pSmHAVVJnsVbeE3Gnqfr94ppezgixVVvWZtguCRXa3
     *             safeTransferFrom:
     *               summary: Example for safeTransferFrom operation on ERC721 contract
     *               value:
     *                 tokenStandard: ERC721
     *                 method: safeTransferFrom
     *                 network: polygonAmoy
     *                 contractAddress: 0x82E1578dC4568e69C55340Ea3240e864dd9E0EB5
     *                 arguments:
     *                   to: 0x308524c70C885521872F3D5C981a8fC650e256FE
     *                   tokenId: 2
     *                   from: 0xe8F910b8eD19BC258b20A0c86e292394EfE38318
     *             transferOwnership:
     *               summary: Example for transferOwnership operation on ERC721 contract
     *               value:
     *                 tokenStandard: ERC721
     *                 method: transferOwnership
     *                 network: polygonAmoy
     *                 contractAddress: 0x82E1578dC4568e69C55340Ea3240e864dd9E0EB5
     *                 arguments:
     *                   newOwner: 0x308524c70C885521872F3D5C981a8fC650e256FE
     *     responses:
     *       200:
     *         description: Operation successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: integer
     *                   example: 200
     *                 message:
     *                   type: string
     *                   example: Minting successful
     *                 error:
     *                   type: string
     *                   nullable: true
     *                   example: null
     *                 body:
     *                   type: object
     *                   properties:
     *                     hash:
     *                       type: string
     *                       example: 0x7c724de16f76042a6c0d658ccb1b1b801a53a52df07fddcb3e64d5703405d881
     *             examples:
     *               safeMint:
     *                 summary: Example response for safeMint operation
     *                 value:
     *                   status: 200
     *                   message: Minting successfull
     *                   error: null
     *                   body:
     *                     hash: 0x7c724de16f76042a6c0d658ccb1b1b801a53a52df07fddcb3e64d5703405d881
     *               safeTransferFrom:
     *                 summary: Example response for safeTransferFrom operation
     *                 value:
     *                   status: 200
     *                   message: Transfer successfull
     *                   error: null
     *                   body:
     *                     hash: 0xdaad0768de242920bd4b3a967f0049ec8386e2c13b02e22395cc9c6bc4add3c7
     *               transferOwnership:
     *                 summary: Example response for transferOwnership operation
     *                 value:
     *                   status: 200
     *                   message: Ownership transferred successfully
     *                   error: null
     *                   body:
     *                     hash: 0x7cd9aa2adccc647ced04b4dba1a2b9f375eb5b07038ae955ddd0352a34ba6171
     */
    app.post('/v1/token/erc721/write-contract', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().writeContractERC721(req);
        return res.status(response.status).send(response);
    });

    /**
     * @swagger
     * /v1/token/erc1155/read-contract:
     *   post:
     *     tags:
     *       - ERC1155
     *     summary: Read data from an ERC1155 token contract
     *     description: Fetch details such as name, URI, balance from an ERC1155 token contract.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               tokenStandard:
     *                 type: string
     *                 enum: [ERC1155]
     *               method:
     *                 type: string
     *                 enum: [name, uri, balanceOf]
     *               network:
     *                 type: string
     *                 example: polygonAmoy
     *               contractAddress:
     *                 type: string
     *                 example: 0x098e6b28C1948054807ba740f691b8de503b2B33
     *               arguments:
     *                 type: object
     *                 properties:
     *                   tokenId:
     *                     type: integer
     *                     example: 1
     *                   account:
     *                     type: string
     *                     example: 0xe8F910b8eD19BC258b20A0c86e292394EfE38318
     *                   id:
     *                     type: integer
     *                     example: 1
     *           examples:
     *             name:
     *               summary: Example for fetching name of an ERC1155 contract
     *               value:
     *                 tokenStandard: ERC1155
     *                 method: name
     *                 network: polygonAmoy
     *                 contractAddress: 0x098e6b28C1948054807ba740f691b8de503b2B33
     *             uri:
     *               summary: Example for fetching URI of an ERC1155 contract
     *               value:
     *                 tokenStandard: ERC1155
     *                 method: uri
     *                 network: polygonAmoy
     *                 contractAddress: 0x098e6b28C1948054807ba740f691b8de503b2B33
     *                 arguments:
     *                   tokenId: 1
     *             balanceOf:
     *               summary: Example for fetching balance of an ERC1155 token
     *               value:
     *                 tokenStandard: ERC1155
     *                 method: balanceOf
     *                 network: polygonAmoy
     *                 contractAddress: 0x098e6b28C1948054807ba740f691b8de503b2B33
     *                 arguments:
     *                   account: 0xe8F910b8eD19BC258b20A0c86e292394EfE38318
     *                   id: 1
     *     responses:
     *       200:
     *         description: Data fetched successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: integer
     *                   example: 200
     *                 message:
     *                   type: string
     *                   example: Data fetched successfully
     *                 error:
     *                   type: string
     *                   nullable: true
     *                   example: null
     *                 body:
     *                   type: object
     *                   properties:
     *                     name:
     *                       type: string
     *                       example: Loyyal Token1017
     *                     uri:
     *                       type: string
     *                       example: https://silver-recent-marlin-593.mypinata.cloud/ipfs/QmY2pSmHAVVJnsVbeE3Gnqfr94ppezgixVVvWZtguCRXa3
     *                     balance:
     *                       type: integer
     *                       example: 6
     *             examples:
     *               name:
     *                 summary: Example response for fetching name of an ERC1155 contract
     *                 value:
     *                   status: 200
     *                   message: Name of NFT fetched successfully
     *                   error: null
     *                   body:
     *                     name: Loyyal Token1017
     *               uri:
     *                 summary: Example response for fetching URI of an ERC1155 contract
     *                 value:
     *                   status: 200
     *                   message: tokenUri of NFT fetched successfully
     *                   error: null
     *                   body:
     *                     uri: https://silver-recent-marlin-593.mypinata.cloud/ipfs/QmY2pSmHAVVJnsVbeE3Gnqfr94ppezgixVVvWZtguCRXa3
     *               balanceOf:
     *                 summary: Example response for fetching balance of an ERC1155 token
     *                 value:
     *                   status: 200
     *                   message: Balance of NFT fetched successfully
     *                   error: null
     *                   body:
     *                     balance: 6
     */
    app.post('/v1/token/erc1155/read-contract', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().readContractERC1155(req);
        return res.status(response.status).send(response);
    });

    /**
     * @swagger
     * /v1/token/erc1155/write-contract:
     *   post:
     *     tags:
     *       - ERC1155
     *     summary: Write to an ERC1155 token contract
     *     description: Perform write operations like minting, transferring, batch minting, batch transferring, and transferring ownership on an ERC1155 token contract.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               tokenStandard:
     *                 type: string
     *                 example: ERC1155
     *               method:
     *                 type: string
     *                 enum: [mint, safeTransferFrom, mintBatch, safeBatchTransferFrom, transferOwnership]
     *                 example: mint
     *               network:
     *                 type: string
     *                 example: polygonAmoy
     *               contractAddress:
     *                 type: string
     *                 example: 0x098e6b28C1948054807ba740f691b8de503b2B33
     *               arguments:
     *                 type: object
     *                 properties:
     *                   account:
     *                     type: string
     *                     example: 0xe8F910b8eD19BC258b20A0c86e292394EfE38318
     *                   amount:
     *                     type: integer
     *                     example: 9
     *                   tokenURI:
     *                     type: string
     *                     example: https://silver-recent-marlin-593.mypinata.cloud/ipfs/QmY2pSmHAVVJnsVbeE3Gnqfr94ppezgixVVvWZtguCRXa3
     *                   data:
     *                     type: string
     *                     example: 0x
     *                   from:
     *                     type: string
     *                     example: 0xe8F910b8eD19BC258b20A0c86e292394EfE38318
     *                   to:
     *                     type: string
     *                     example: 0x308524c70C885521872F3D5C981a8fC650e256FE
     *                   id:
     *                     type: integer
     *                     example: 1
     *                   value:
     *                     type: integer
     *                     example: 3
     *                   ids:
     *                     type: array
     *                     items:
     *                       type: integer
     *                     example: [2, 3, 4, 5]
     *                   values:
     *                     type: array
     *                     items:
     *                       type: integer
     *                     example: [20, 30, 40, 50]
     *                   newOwner:
     *                     type: string
     *                     example: 0x308524c70C885521872F3D5C981a8fC650e256FE
     *           examples:
     *             mint:
     *               summary: Example for minting an ERC1155 token
     *               value:
     *                 tokenStandard: ERC1155
     *                 method: mint
     *                 network: polygonAmoy
     *                 contractAddress: 0x098e6b28C1948054807ba740f691b8de503b2B33
     *                 arguments:
     *                   account: 0xe8F910b8eD19BC258b20A0c86e292394EfE38318
     *                   amount: 9
     *                   tokenURI: https://silver-recent-marlin-593.mypinata.cloud/ipfs/QmY2pSmHAVVJnsVbeE3Gnqfr94ppezgixVVvWZtguCRXa3
     *                   data: 0x
     *             safeTransferFrom:
     *               summary: Example for transferring an ERC1155 token
     *               value:
     *                 tokenStandard: ERC1155
     *                 method: safeTransferFrom
     *                 network: polygonAmoy
     *                 contractAddress: 0x098e6b28C1948054807ba740f691b8de503b2B33
     *                 arguments:
     *                   from: 0xe8F910b8eD19BC258b20A0c86e292394EfE38318
     *                   to: 0x308524c70C885521872F3D5C981a8fC650e256FE
     *                   id: 1
     *                   value: 3
     *                   data: 0x
     *             mintBatch:
     *               summary: Example for batch minting ERC1155 tokens
     *               value:
     *                 tokenStandard: ERC1155
     *                 method: mintBatch
     *                 network: polygonAmoy
     *                 contractAddress: 0x098e6b28C1948054807ba740f691b8de503b2B33
     *                 arguments:
     *                   to: 0xe8F910b8eD19BC258b20A0c86e292394EfE38318
     *                   ids: [2, 3, 4, 5]
     *                   amounts: [20, 30, 40, 50]
     *                   data: 0x
     *             safeBatchTransferFrom:
     *               summary: Example for batch transferring ERC1155 tokens
     *               value:
     *                 tokenStandard: ERC1155
     *                 method: safeBatchTransferFrom
     *                 network: polygonAmoy
     *                 contractAddress: 0x098e6b28C1948054807ba740f691b8de503b2B33
     *                 arguments:
     *                   from: 0xe8F910b8eD19BC258b20A0c86e292394EfE38318
     *                   to: 0x308524c70C885521872F3D5C981a8fC650e256FE
     *                   ids: [2, 3, 4, 5]
     *                   values: [20, 30, 40, 50]
     *                   data: 0x
     *             transferOwnership:
     *               summary: Example for transferring ownership of an ERC1155 contract
     *               value:
     *                 tokenStandard: ERC1155
     *                 method: transferOwnership
     *                 network: polygonAmoy
     *                 contractAddress: 0x098e6b28C1948054807ba740f691b8de503b2B33
     *                 arguments:
     *                   newOwner: 0x308524c70C885521872F3D5C981a8fC650e256FE
     *     responses:
     *       200:
     *         description: Successful response
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: integer
     *                   example: 200
     *                 message:
     *                   type: string
     *                   example: Minting successful
     *                 error:
     *                   type: object
     *                   nullable: true
     *                 body:
     *                   type: object
     *                   properties:
     *                     txHash:
     *                       type: string
     *                       example: 0xfb0fb294b2660e86d5fddbb549587bbfb3e37d8c08a03b1c02fb8d5dfa50c082
     *                     hash:
     *                       type: string
     *                       example: 0x86d5295f505aaf92a78c19c1e9d4750abc7f5b67ba5df01226640de3d03bc9a7
     *             examples:
     *               mint:
     *                 summary: Example response for minting an ERC1155 token
     *                 value:
     *                   status: 200
     *                   message: Minting successful
     *                   error: null
     *                   body:
     *                     txHash: 0xfb0fb294b2660e86d5fddbb549587bbfb3e37d8c08a03b1c02fb8d5dfa50c082
     *               safeTransferFrom:
     *                 summary: Example response for transferring an ERC1155 token
     *                 value:
     *                   status: 200
     *                   message: Transfer successful
     *                   error: null
     *                   body:
     *                     txHash: 0x6d9207ddf66b066e448f0af7cccd056c44d857441a0bdf1929f10215f105a4f4
     *               mintBatch:
     *                 summary: Example response for batch minting ERC1155 tokens
     *                 value:
     *                   status: 200
     *                   message: Batch minting successful
     *                   error: null
     *                   body:
     *                     txHash: 0xc5a3a106e37de9f8c55f245a12cf0b95f2d4601694e02802727e4a71f61c3b18
     *               safeBatchTransferFrom:
     *                 summary: Example response for batch transferring ERC1155 tokens
     *                 value:
     *                   status: 200
     *                   message: Batch transfer successful
     *                   error: null
     *                   body:
     *                     txHash: 0x0f05d51e1a5b61cb3c2cc7a81ecbf4e4c6795f6e925a489c8d9dbf4ce8c12e4d
     *               transferOwnership:
     *                 summary: Example response for transferring ownership of an ERC1155 contract
     *                 value:
     *                   status: 200
     *                   message: Ownership transfer successful
     *                   error: null
     *                   body:
     *                     txHash: 0x34f8b57d8f9d5ff1e2c01d3e036abfbf88ac2f0bba016f3f13130e79de173ba7
     */
     app.post('/v1/token/erc1155/write-contract', async function (req: express.Request, res: express.Response) {
        const response: any = await new BlockchainService().writeContractERC1155(req);
        return res.status(response.status).send(response);
    });
}

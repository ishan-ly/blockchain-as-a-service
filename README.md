
# Blockchain Service APIs

This repo contains source code for Blockchain as a service(BAAS). 


## Features

- Deployment of smart contracts of standards ERC20, ERC721 and ERC1155
- Perform read and write operations on your deployed smart contracts
- Swagger UI integration to interact with APIs directly


## Run Locally

Clone the project

```bash
  git clone https://github.com/loyyal/blockchain-service-apis.git
```

Go to the project directory

```bash
  cd blockchain-service-apis
```

Install dependencies

```bash
  npm install
```
Compile smart contracts

```bash
  npx hardhat compile
```
Build
```bash
  npm run build
```

Start the server

```bash
  npm run start
```


## Deployment

Building docker image

```bash
aws ecr get-login-password --region me-south-1 | docker login --username AWS --password-stdin 827830277284.dkr.ecr.me-south-1.amazonaws.com

docker build -t 827830277284.dkr.ecr.me-south-1.amazonaws.com/nft-marketplace-be:v2.1 .

docker push 827830277284.dkr.ecr.me-south-1.amazonaws.com/nft-marketplace-be:v2.1
```
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`PRIVATE_KEY`

`ETHERSCAN_API_KEY`

`POLYGONSCAN_API_KEY`

`JSON_RPC_PROVIDER_SEPOLIA`

`JSON_RPC_PROVIDER_AMOY`

`APP_BASE_URL`

`SENING_EMAIL`

`MONGODB_URI`

`MONGODB_DBNAME`

`NOTIFICATION_SERVICE_BASE_URL`

`DEFAULT_EMAIL_FROM`

`TEMPLATE_ID_NFT_AIRDROP`


## Appendix

- Factory contracts are already deployed on supported chains. You can configure supported chains, contract addresses and ABI from config/config-chain.ts

- You can access Swagger UI documentation at root route of the project. For example if you are running this project locally at PORT 3000, you can find Swagger UI at http://localhost:3000/


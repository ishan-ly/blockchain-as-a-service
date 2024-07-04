import swaggerJsDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
dotenv.config({path : '.env'});
const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Blockchain Service APIs',
        version: '1.0.0',
        description: 'API documentation for blockchain as a service. To deploy smart contracts and interact with deployed smart contracts'
      },
      servers: [
        {
          url: `${process.env.APP_BASE_URL}`
        }
      ],
      tags: [
        {
          name: 'Deploy',
          description: 'APIs related to token deployment operations'
        },
        {
          name: 'ERC20',
          description: 'APIs related to operations on ERC20 deployed contracts'
        },
        {
          name: 'ERC721',
          description: 'APIs related to operations on ERC721 deployed contracts'
        },
        {
           name: 'ERC1155',
           description: 'APIs related to operations on ERC1155 deployed contracts'
        },
      ]
    },
    apis: ['./src/controllers/**/*.ts']
  };

export default swaggerJsDoc(swaggerOptions);

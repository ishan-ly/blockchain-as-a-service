import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
const dotenv = require('dotenv');
import cors from 'cors';
import * as http from 'http';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs  from './swagger/swagger';

import controllers from './src/controllers';
const cron = require("node-cron");
dotenv.config();

const app: Express = express()
app.options('*', cors());
app.use(cors());
app.use(bodyParser({ limit: '50mb' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false,
}));


cron.schedule("0 0 1 * *", async () => {
    console.log("A cron job that runs every 30 seconds " + new Date());
});

controllers(app);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const server = http.createServer(app);
server.listen(process.env.PORT, () => {
    console.log(`blockchain-service api is running on port ${process.env.PORT}`);
});
server.timeout = 240000;

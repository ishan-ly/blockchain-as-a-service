import { CustomResponse } from "../models/custom-response.model";
import { v4 as uuidv4 } from "uuid";

import log4js = require('log4js');
const logger = log4js.getLogger('Common Utils');

export class CommonUtils {
    static generateTimeStamp() {
        return JSON.stringify(new Date());
    }
    static prepareErrorMessage(error: any) {
        console.error(error);
        switch (error.name) {
            case 'UnauthorisedError':
                return new CustomResponse(401, error.message, null, null);
            case 'ReferenceError':
                return new CustomResponse(400, error.message, null, null);
            case 'InvalidInputError':
                return new CustomResponse(400, error.message, null, null);
            case 'CustomError':
                return new CustomResponse(422, error.message, null, null);
            default:
                return new CustomResponse(500, 'Ohh, something went wrong.', null, null);
        }
    }

    static generateUniqueUUID(): string {
        return uuidv4();
    }



}
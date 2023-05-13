import {StatusCodes} from "http-status-codes";

export class BaseError extends Error {
    constructor(message: string) {
        super(message);
    }

    public get statusCode() {
        return StatusCodes.INTERNAL_SERVER_ERROR
    }

    public get key() {
        return 'internal_server_error'
    }
}
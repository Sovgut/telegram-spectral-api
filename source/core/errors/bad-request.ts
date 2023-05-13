import {BaseError} from "~core/errors/base.js";
import {StatusCodes} from "http-status-codes";

export class BadRequestError extends BaseError {
    constructor(readonly message: string, readonly messageKey: string) {
        super(message);
    }

    public override get statusCode() {
        return StatusCodes.BAD_REQUEST
    }

    public override get key() {
        return this.messageKey ?? 'bad_request'
    }
}
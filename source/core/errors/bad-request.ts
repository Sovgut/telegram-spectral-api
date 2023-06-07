import { BaseError } from "~core/errors/base.js";
import { StatusCodes } from "http-status-codes";

export class BadRequestError extends BaseError {
	constructor(readonly message: string, readonly messageKey: string) {
		super(message);
	}

	public override readonly statusCode: number = StatusCodes.BAD_REQUEST;
	public override readonly key: string = this.messageKey ?? "bad_request";
}

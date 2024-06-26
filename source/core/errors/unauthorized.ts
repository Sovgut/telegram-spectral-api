import { BaseError } from "~core/errors/base.js";
import { StatusCodes } from "http-status-codes";

export class UnauthorizedError extends BaseError {
	constructor(readonly message: string, readonly messageKey: string) {
		super(message);
	}

	public override readonly statusCode: number = StatusCodes.UNAUTHORIZED;
	public override readonly key: string = this.messageKey ?? "unauthorized";
}

import { BaseError } from "~core/errors/base.js";
import { StatusCodes } from "http-status-codes";

export class ForbiddenError extends BaseError {
	constructor(readonly message: string, readonly messageKey: string) {
		super(message);
	}

	public override readonly statusCode: number = StatusCodes.FORBIDDEN;
	public override readonly key: string = this.messageKey ?? "forbidden";
}

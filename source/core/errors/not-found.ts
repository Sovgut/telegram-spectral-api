import { BaseError } from "~core/errors/base.js";
import { StatusCodes } from "http-status-codes";

export class NotFoundError extends BaseError {
	constructor(readonly message: string, readonly messageKey: string) {
		super(message);
	}

	public override get statusCode(): number {
		return StatusCodes.NOT_FOUND;
	}

	public override readonly key: string = this.messageKey ?? "not_found";
}

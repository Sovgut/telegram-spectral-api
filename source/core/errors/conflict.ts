import { BaseError } from "~core/errors/base.js";
import { StatusCodes } from "http-status-codes";

export class ConflictError extends BaseError {
  constructor(readonly message: string, readonly messageKey: string) {
    super(message);
  }

  public override get statusCode(): number {
    return StatusCodes.CONFLICT;
  }

  public override readonly key: string = this.messageKey ?? "conflict";
}

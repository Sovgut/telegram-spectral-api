import { StatusCodes } from "http-status-codes";

export class BaseError extends Error {
	public readonly statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
	public readonly key: string = "internal_server_error";
}

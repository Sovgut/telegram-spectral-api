import axios from "axios";
import { type FastifyError, type FastifyReply, type FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { Config } from "~core/config/class.js";
import { BaseError } from "~core/errors/base.js";
import { Logger } from "~core/logger/class.js";
import { Core } from "~core/namespace.js";
import { TelegramWatcher } from "~core/telegram/watcher/class.js";
import { type IWebhook } from "~database/models/webhook.js";

export class Http {
	private readonly logger = new Logger("Http");

	public async errorHandler(error: BaseError | FastifyError | Error, request: FastifyRequest, reply: FastifyReply): Promise<unknown> {
		if (Config.App.Environment !== "production") {
			this.logger.error({
				scope: "errorHandler",
				message: error?.message,
				exception: {
					name: error?.name,
					stack: error?.stack,
				},
			});
		}

		if (error instanceof BaseError) {
			return reply.status(error.statusCode).send({
				statusCode: error.statusCode,
				error: error.message,
				key: error.key,
			});
		}

		if ("validation" in error) {
			let key = "validation_failed";
			let params: Record<string, string | string[]> = {};

			if (Array.isArray(error.validation)) {
				const validation = error.validation[0];
				const [path] = validation.instancePath.split("/").filter(Boolean);

				if (validation.keyword === "required") {
					let missingProperty = validation.params.missingProperty;

					if (Array.isArray(missingProperty)) {
						missingProperty = missingProperty[0];
					}

					key = `${missingProperty}_validation_failed`;
				}

				if (validation.keyword === "enum") {
					key = `${path}_validation_failed`;
				}

				params = validation.params;
			}

			return reply.status(StatusCodes.BAD_REQUEST).send(
				Core.Utils.partial({
					statusCode: StatusCodes.BAD_REQUEST,
					error: error.message,
					key,
					params: Object.keys(params).length > 0 ? params : undefined,
				})
			);
		}

		reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
			statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
			error: error?.message,
			key: "internal_server_error",
		});
	}

	public async invokeWebhook(webhook: IWebhook, payload: unknown): Promise<void | never> {
		const response = await axios.post(webhook.url, payload, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${webhook.token}`,
			},
		});

		if (!response.status.toString().startsWith("2")) {
			throw new Error(`Webhook returned ${response.status} ${response.statusText}`);
		}
	}

	public async onServerStart(error: Error | null, address: string): Promise<void> {
		const telegramWatcher = new TelegramWatcher();

		if (error !== null) {
			await this.logger.error({
				scope: "onServerStart",
				message: error?.message,
				exception: error,
			});

			process.exit(1);
		}

		await this.logger.info({
			scope: "http:hooks:onServerStart",
			message: `Listening on ${address}`,
		});

		await telegramWatcher.start();
	}

	public async requestAuthorization(request: FastifyRequest, reply: FastifyReply, done: (error?: Error | undefined) => void): Promise<unknown> {
		const [, token] = request.headers.authorization?.split(" ") ?? [];

		if (token !== Config.App.Secret) {
			return reply.code(StatusCodes.UNAUTHORIZED).send({
				status: StatusCodes.UNAUTHORIZED,
				error: "Unauthorized",
			});
		}

		done();
	}

	public async requestLogger(request: FastifyRequest, reply: FastifyReply, done: (error?: Error | undefined) => void): Promise<void> {
		this.logger.log({
			scope: "requestLogger",
			message: "Request received",
			method: request.method,
			url: request.url,
			params: request.params,
			query: request.query,
			body: request.body,
		});

		done();
	}
}

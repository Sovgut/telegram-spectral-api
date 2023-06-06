import { type FastifyReply, type FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { Config } from "~core/config/class.js";

export function requestAuthorization(request: FastifyRequest, reply: FastifyReply, done: (error?: Error | undefined) => void): unknown {
	const [, token] = request.headers.authorization?.split(" ") ?? [];

	if (token !== Config.App.Secret) {
		return reply.code(StatusCodes.UNAUTHORIZED).send({
			status: StatusCodes.UNAUTHORIZED,
			error: "Unauthorized",
		});
	}

	done();
}

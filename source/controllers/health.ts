import { type FastifyInstance, type FastifyRegisterOptions, type FastifyReply, type FastifyRequest } from "fastify";
import { type Request } from "~types/request.js";
import { StatusCodes } from "http-status-codes";

export class HealthController {
	public static async register(fastify: FastifyInstance, _opts: FastifyRegisterOptions<unknown>): Promise<void> {
		const instance = new HealthController();

		fastify.route({
			method: "GET",
			url: "/health-check",
			handler: instance.check.bind(instance),
		});
	}

	public async check(_request: FastifyRequest<Request.Publish.Media>, reply: FastifyReply): Promise<void> {
		reply.status(StatusCodes.OK).send();
	}
}

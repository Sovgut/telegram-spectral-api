import { type FastifyInstance, type FastifyRegisterOptions, type FastifyReply, type FastifyRequest } from "fastify";
import { type Request } from "~types/request.js";
import { StatusCodes } from "http-status-codes";
import { Validations } from "~core/http/validations.js";
import { WebhookService } from "~services/webhooks/class.js";
import { Types } from "mongoose";

export class WebhookController {
	private readonly webhookService = new WebhookService();

	public static async register(fastify: FastifyInstance, _opts: FastifyRegisterOptions<unknown>): Promise<void> {
		const instance = new WebhookController();

		fastify.route({
			method: "POST",
			url: "/webhook",
			schema: Validations.Webhook.Create,
			handler: instance.createWebhook.bind(instance),
		});

		fastify.route({
			method: "DELETE",
			url: "/webhook/:channelId",
			schema: Validations.Webhook.Delete,
			handler: instance.deleteWebhook.bind(instance),
		});

		fastify.route({
			method: "GET",
			url: "/webhook/:channelId",
			schema: Validations.Webhook.GetOne,
			handler: instance.getWebhook.bind(instance),
		});

		fastify.route({
			method: "GET",
			url: "/webhook",
			schema: Validations.Webhook.GetMany,
			handler: instance.getWebhooks.bind(instance),
		});
	}

	public async createWebhook(request: FastifyRequest<Request.Webhook.CreateWebhook>, reply: FastifyReply): Promise<void> {
		const channel = await this.webhookService.create({
			channel: new Types.ObjectId(request.body.channelId),
			url: request.body.url,
			token: request.body.token,
		});

		reply.status(StatusCodes.CREATED).send({
			statusCode: StatusCodes.CREATED,
			data: channel,
		});
	}

	public async deleteWebhook(request: FastifyRequest<Request.Webhook.DeleteWebhook>, reply: FastifyReply): Promise<void> {
		await this.webhookService.delete(request.params.channelId);

		reply.status(StatusCodes.OK).send({
			statusCode: StatusCodes.OK,
		});
	}

	public async getWebhook(request: FastifyRequest<Request.Webhook.GetWebhook>, reply: FastifyReply): Promise<void> {
		const webhook = await this.webhookService.read(request.params.channelId);

		reply.status(StatusCodes.OK).send({
			statusCode: StatusCodes.OK,
			data: webhook,
		});
	}

	public async getWebhooks(request: FastifyRequest<Request.Webhook.GetWebhooks>, reply: FastifyReply): Promise<void> {
		const webhooks = await this.webhookService.list();

		reply.status(StatusCodes.OK).send({
			statusCode: StatusCodes.OK,
			data: webhooks,
		});
	}
}

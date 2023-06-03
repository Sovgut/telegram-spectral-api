import { type FastifyInstance, type FastifyRegisterOptions, type FastifyReply, type FastifyRequest } from "fastify";
import { type Request } from "~types/request.js";
import { StatusCodes } from "http-status-codes";
import { Validations } from "~core/http/validations.js";
import { Channel } from "~repositories/channel/model.js";
import { type ChannelEntity } from "~core/telegram/channel/types.js";
import { TelegramChannelProvider } from "~core/telegram/channel/class.js";

export class ChannelController {
	public async listenChannel(request: FastifyRequest<Request.Channel.ListenChannel>, reply: FastifyReply): Promise<void> {
		const channel = await Channel.create(request.body.title, request.body.reference);

		reply.status(StatusCodes.CREATED).send({
			statusCode: StatusCodes.CREATED,
			data: channel,
		});
	}

	public async unlistenChannel(request: FastifyRequest<Request.Channel.UnlistenChannel>, reply: FastifyReply): Promise<void> {
		await Channel.delete(request.params.reference);

		reply.status(StatusCodes.OK).send({
			statusCode: StatusCodes.OK,
		});
	}

	public async getOne(request: FastifyRequest<Request.Channel.GetChannel>, reply: FastifyReply): Promise<void> {
		const channel = await Channel.findOne({
			reference: request.params.reference,
		});

		reply.status(StatusCodes.OK).send({
			statusCode: StatusCodes.OK,
			data: channel,
		});
	}

	public async getMany(request: FastifyRequest<Request.Channel.GetChannels>, reply: FastifyReply): Promise<void> {
		let channels: { rows: Channel[]; count: number } | ChannelEntity[] = [];

		if (request.query.source === "cosmos") {
			const [rows, count] = await Channel.findMany({
				id: request.query.id,
				ids: request.query.ids,
				reference: request.query.reference,
				orderBy: request.query.orderBy,
				limit: request.query.limit,
				offset: request.query.offset,
			});

			channels = { rows, count };
		} else {
			const telegramChannelProvider = new TelegramChannelProvider();

			channels = await telegramChannelProvider.getTelegramChannels();
		}

		reply.status(StatusCodes.OK).send({
			statusCode: StatusCodes.OK,
			data: channels,
		});
	}
}

export const ChannelControllerRouter = (fastify: FastifyInstance, _opts: FastifyRegisterOptions<unknown>, done: any): void => {
	const controller = new ChannelController();

	fastify.route({
		method: "POST",
		url: "/channels",
		schema: Validations.Channel.ListenChannel,
		handler: controller.listenChannel,
	});

	fastify.route({
		method: "DELETE",
		url: "/channels/:reference",
		schema: Validations.Channel.UnlistenChannel,
		handler: controller.unlistenChannel,
	});

	fastify.route({
		method: "GET",
		url: "/channels/:channelId",
		schema: Validations.Channel.GetChannel,
		handler: controller.getOne,
	});

	fastify.route({
		method: "GET",
		url: "/channels",
		schema: Validations.Channel.GetChannels,
		handler: controller.getMany,
	});

	done();
};

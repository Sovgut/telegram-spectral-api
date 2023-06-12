import { type FastifyInstance, type FastifyRegisterOptions, type FastifyReply, type FastifyRequest } from "fastify";
import { type Request } from "~types/request.js";
import { StatusCodes } from "http-status-codes";
import { Validations } from "~core/http/validations.js";
import { type ChannelEntity } from "~core/telegram/channel/types.js";
import { TelegramChannelProvider } from "~core/telegram/channel/class.js";
import { type IChannel } from "~database/models/channel.js";
import { ChannelService } from "~services/channels/class.js";
import { type IMongooseMeta } from "~types/entities.js";

export class ChannelController {
	private readonly channelService = new ChannelService();

	public static async register(fastify: FastifyInstance, _opts: FastifyRegisterOptions<unknown>): Promise<void> {
		const instance = new ChannelController();

		fastify.route({
			method: "POST",
			url: "/channels",
			schema: Validations.Channel.ListenChannel,
			handler: instance.listenChannel.bind(instance),
		});

		fastify.route({
			method: "DELETE",
			url: "/channels/:reference",
			schema: Validations.Channel.UnlistenChannel,
			handler: instance.unlistenChannel.bind(instance),
		});

		fastify.route({
			method: "GET",
			url: "/channels/:channelId",
			schema: Validations.Channel.GetChannel,
			handler: instance.getOne.bind(instance),
		});

		fastify.route({
			method: "GET",
			url: "/channels",
			schema: Validations.Channel.GetChannels,
			handler: instance.getMany.bind(instance),
		});
	}

	public async listenChannel(request: FastifyRequest<Request.Channel.ListenChannel>, reply: FastifyReply): Promise<void> {
		const channel = await this.channelService.create({ reference: request.body.reference, title: request.body.title });

		reply.status(StatusCodes.CREATED).send({
			statusCode: StatusCodes.CREATED,
			data: channel,
		});
	}

	public async unlistenChannel(request: FastifyRequest<Request.Channel.UnlistenChannel>, reply: FastifyReply): Promise<void> {
		await this.channelService.delete(request.params.reference);

		reply.status(StatusCodes.OK).send({
			statusCode: StatusCodes.OK,
		});
	}

	public async getOne(request: FastifyRequest<Request.Channel.GetChannel>, reply: FastifyReply): Promise<void> {
		const channel = await this.channelService.read(request.params.reference);

		reply.status(StatusCodes.OK).send({
			statusCode: StatusCodes.OK,
			data: channel,
		});
	}

	public async getMany(request: FastifyRequest<Request.Channel.GetChannels>, reply: FastifyReply): Promise<void> {
		let channels: Array<IChannel & IMongooseMeta> | ChannelEntity[] = [];

		if (request.query.source === "cosmos") {
			// TODO: implement query params
			//
			// id: request.query.id,
			// ids: request.query.ids,
			// reference: request.query.reference,
			// orderBy: request.query.orderBy,
			// limit: request.query.limit,
			// offset: request.query.offset,

			channels = await this.channelService.list();
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

import { Decorators } from "~core/decorators.js";
import { NotFoundError } from "~core/errors/not-found.js";
import { Channel, type IChannel } from "~database/models/channel.js";
import { type IMongooseMeta } from "~types/entities.js";

export class ChannelService {
	private readonly model = Channel;

	@Decorators.Logger("Creating channel")
	public async create(data: IChannel): Promise<(IChannel & IMongooseMeta) | never> {
		const channel = await this.model.create({
			title: data.title,
			reference: data.reference,
		});

		return channel.toObject();
	}

	@Decorators.Logger("Getting channel")
	public async read(reference: string): Promise<(IChannel & IMongooseMeta) | never> {
		const channel = await this.model.findOne({ reference });

		if (channel === null) {
			throw new NotFoundError(`Channel with reference ${reference} not found`, "channel_not_found");
		}

		return channel.toObject();
	}

	@Decorators.Logger("Getting channels")
	public async list(): Promise<Array<IChannel & IMongooseMeta>> {
		const channels = await this.model.find();

		return channels.map((channel) => channel.toObject());
	}

	@Decorators.Logger("Updating channel")
	public async update(reference: string, data: IChannel): Promise<(IChannel & IMongooseMeta) | never> {
		const channel = await this.model.findOneAndUpdate(
			{ reference },
			{
				title: data.title,
				reference: data.reference,
			},
			{
				new: true,
			}
		);

		if (channel === null) {
			throw new NotFoundError(`Channel with reference ${reference} not found`, "channel_not_found");
		}

		return channel.toObject();
	}

	@Decorators.Logger("Deleting channel")
	public async delete(reference: string): Promise<void | never> {
		const response = await this.model.deleteOne({ reference });

		if (response.deletedCount === 0) {
			throw new NotFoundError(`Channel with reference ${reference} not found`, "channel_not_found");
		}
	}
}

import { Decorators } from "~core/decorators.js";
import { NotFoundError } from "~core/errors/not-found.js";
import { IWebhook, Webhook } from "~database/models/webhook.js";
import { type IMongooseMeta } from "~types/entities.js";

export class WebhookService {
	private readonly model = Webhook;

	@Decorators.Logger("Creating webhook")
	public async create(data: IWebhook): Promise<(IWebhook & IMongooseMeta) | never> {
		const webhook = await this.model.create({
			url: data.url,
			token: data.token,
			channel: data.channel,
		});

		return webhook.toObject();
	}

	@Decorators.Logger("Getting webhook")
	public async read(channel: string): Promise<(IWebhook & IMongooseMeta) | never> {
		const webhook = await this.model.findOne({ channel });

		if (webhook === null) {
			throw new NotFoundError(`Webhook with channel ${channel} not found`, "webhook_not_found");
		}

		return webhook.toObject();
	}

	@Decorators.Logger("Getting webhooks")
	public async list(): Promise<Array<IWebhook & IMongooseMeta>> {
		const webhooks = await this.model.find();

		return webhooks.map((webhook) => webhook.toObject());
	}

	@Decorators.Logger("Updating webhook")
	public async update(channel: string, data: IWebhook): Promise<(IWebhook & IMongooseMeta) | never> {
		const webhook = await this.model.findOneAndUpdate(
			{ channel },
			{
				url: data.url,
				token: data.token,
				channel: data.channel,
			},
			{
				new: true,
			}
		);

		if (webhook === null) {
			throw new NotFoundError(`Webhook with channel ${channel} not found`, "webhook_not_found");
		}

		return webhook.toObject();
	}

	@Decorators.Logger("Deleting webhook")
	public async delete(channel: string): Promise<void | never> {
		const webhook = await this.model.deleteOne({ channel });

		if (webhook.deletedCount === 0) {
			throw new NotFoundError(`Webhook with channel ${channel} not found`, "webhook_not_found");
		}
	}
}

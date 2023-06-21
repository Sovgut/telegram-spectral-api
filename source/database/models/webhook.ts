import { connection } from "~database/connection.js";
import { Schema } from "mongoose";

export interface IWebhook {
	readonly url: string;
	readonly token: string;
}

const schema = new Schema<IWebhook>(
	{
		url: {
			type: Schema.Types.String,
			unique: true,
			required: true,
		},
		token: {
			type: Schema.Types.String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export const Webhook = connection.model<IWebhook>("webhooks", schema);

import { connection } from "~database/connection.js";
import { Schema, type Types } from "mongoose";

export interface IWebhook {
	readonly url: string;
	readonly token: string;
	readonly channel: Types.ObjectId;
}

const schema = new Schema<IWebhook>(
	{
		url: {
			type: Schema.Types.String,
			required: true,
		},
		token: {
			type: Schema.Types.String,
			required: true,
		},
		channel: {
			type: Schema.Types.ObjectId,
			ref: "channels",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export const Webhook = connection.model<IWebhook>("webhooks", schema);

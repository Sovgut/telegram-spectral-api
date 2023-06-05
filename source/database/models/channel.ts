import { connection } from "~database/connection.js";
import { Schema } from "mongoose";

export interface IChannel {
	readonly title: string;
	readonly reference: string;
	readonly webhooks?: Array<typeof Schema.Types.ObjectId>;
}

const schema = new Schema<IChannel>(
	{
		title: {
			type: Schema.Types.String,
			required: true,
		},
		reference: {
			type: Schema.Types.String,
			required: true,
			unique: true,
		},
		webhooks: [
			{
				type: Schema.Types.ObjectId,
				ref: "webhooks",
			},
		],
	},
	{
		timestamps: true,
	}
);

export const Channel = connection.model<IChannel>("channels", schema);

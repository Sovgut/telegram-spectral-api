import { connection } from "~database/connection.js";
import { Schema, type Types } from "mongoose";

export interface IDocument {
	readonly channel: Types.ObjectId;
	readonly groupId?: string;
	readonly name: string;
	readonly size: number;
	readonly mimeType: string;
	readonly location: string;
	readonly flags: number;
}

const schema = new Schema<IDocument>(
	{
		channel: {
			type: Schema.Types.ObjectId,
			ref: "channels",
			required: true,
		},
		groupId: {
			type: Schema.Types.String,
		},
		name: {
			type: Schema.Types.String,
			required: true,
		},
		size: {
			type: Schema.Types.Number,
			required: true,
		},
		mimeType: {
			type: Schema.Types.String,
			required: true,
		},
		location: {
			type: Schema.Types.String,
			required: true,
		},
		flags: {
			type: Schema.Types.Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export const Document = connection.model<IDocument>("documents", schema);

export const ReadonlyDocument = 1 << 0;
export const StorageTelegram = 1 << 1;
export const StorageAzure = 1 << 2;

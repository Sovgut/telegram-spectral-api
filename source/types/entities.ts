import { type Types } from "mongoose";

export interface IDocument {
	type: "photo" | "video";
	url: string;
}

export interface IButton {
	text: string;
	url: string;
}

export interface IMongooseMeta {
	readonly _id: Types.ObjectId;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

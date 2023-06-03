import { type IThumbnail } from "~types/common/file-service.js";
import { type Document } from "~repositories/document/model.js";

export interface IPublishTextMessage {
	kind: "text";
	text: string;
}

export interface IPublishMediaMessage {
	kind: "media";
	text: string;
	document: Document;
}

export interface IPublishMediaGroupMessage {
	kind: "mediaGroup";
	text: string;
	documents: Document[];
}

export interface IPublishAdvertisementMessage {
	kind: "advertisement";
	text: string;
	document: Document;
	button: {
		text: string;
		url: string;
	};
}

export interface IMedia {
	url: string;
	type: "photo" | "video";
}

export interface Attachment {
	type: "photo" | "video";
	mimeType: string;
	filename: string;
	filepath: string;
	caption?: string;
	thumbnail?: IThumbnail;
}

export type PublishOptions = IPublishTextMessage | IPublishMediaMessage | IPublishMediaGroupMessage | IPublishAdvertisementMessage;

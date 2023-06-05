import { type IDocument } from "~database/models/document.js";
import { type IThumbnail } from "~types/common/file-service.js";

export interface IPublishTextMessage {
	kind: "text";
	text: string;
}

export interface IPublishMediaMessage {
	kind: "media";
	text: string;
	document: IDocument;
}

export interface IPublishMediaGroupMessage {
	kind: "mediaGroup";
	text: string;
	documents: IDocument[];
}

export interface IPublishAdvertisementMessage {
	kind: "advertisement";
	text: string;
	document: IDocument;
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

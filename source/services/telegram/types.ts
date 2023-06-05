import { type ReadStream } from "node:fs";

export interface TelegramMessageButton {
	text: string;
	url: string;
}

export interface Attachment {
	stream: ReadStream;
	filename: string;
	media: string;
	type: string;
	caption?: string;
	parse_mode?: string;
	thumbnail?: { label: string; filename: string; stream: ReadStream };
}

export interface AttachmentPayload {
	type: string;
	media: string;
	caption?: string;
	parse_mode?: string;
	thumb?: string;
}

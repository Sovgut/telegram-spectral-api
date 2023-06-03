export interface DocumentCreate {
	readonly name: string;
	readonly size: number;
	readonly mimeType: string;
	readonly location: string;
	readonly flags: number;
}

export interface DocumentUpdate {
	readonly name: string;
	readonly size: number;
	readonly mimeType: string;
	readonly location: string;
	readonly flags: number;
}

export interface DocumentQuery {
	readonly id?: string;
	readonly name?: string;
	readonly location?: string;
	readonly mimeType?: string;
	readonly flags?: number;
}

export type DocumentListQuery = DocumentQuery & { ids?: string[]; orderBy?: string; limit: number; offset: number };

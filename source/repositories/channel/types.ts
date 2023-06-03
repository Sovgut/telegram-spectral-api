export interface ChannelQuery {
	readonly id?: string;
	readonly title?: string;
	readonly reference?: string;
}

export type ChannelListQuery = ChannelQuery & { ids?: string[]; orderBy?: string; limit: number; offset: number };

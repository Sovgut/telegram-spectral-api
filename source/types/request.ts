export namespace Request {
	export namespace Channel {
		export interface ListenChannel {
			Body: {
				reference: string;
				title: string;
			};
		}

		export interface UnlistenChannel {
			Params: {
				reference: string;
			};
		}

		export interface GetChannel {
			Params: {
				reference: string;
			};
		}

		export interface GetChannels {
			Querystring: {
				id?: string;
				ids?: string[];
				reference?: string;
				orderBy?: string;
				limit: number;
				offset: number;
				source: "telegram" | "cosmos";
			};
		}
	}
	export namespace Document {
		export interface Delete {
			Params: {
				documentId: string;
			};
		}

		export interface GetOne {
			Params: {
				documentId: string;
			};
		}

		export interface GetMany {
			Querystring: {
				id?: string;
				ids?: string[];
				location?: string;
				name?: string;
				mimeType?: string;
				flags?: number;
				orderBy?: string;
				limit: number;
				offset: number;
			};
		}
	}

	export namespace Publish {
		export interface Media {
			Body: {
				chatId: string;
				text: string;
				documentId: string;
				button?: { url: string; text: string };
			};
		}

		export interface Album {
			Body: {
				chatId: string;
				text: string;
				documentIds: string[];
			};
		}

		export interface Text {
			Body: {
				chatId: string;
				text: string;
				button?: { url: string; text: string };
			};
		}
	}
}

import { type FastifySchema } from "fastify";

export namespace Validations {
	export namespace Channel {
		export const ListenChannel: FastifySchema = {
			body: {
				type: "object",
				properties: {
					reference: { type: "string" },
					title: { type: "string" },
				},
				required: ["reference", "title"],
			},
		};

		export const UnlistenChannel: FastifySchema = {
			params: {
				type: "object",
				properties: {
					reference: { type: "string" },
				},
				required: ["reference"],
			},
		};

		export const GetChannel: FastifySchema = {
			params: {
				type: "object",
				properties: {
					reference: { type: "string" },
				},
				required: ["reference"],
			},
		};

		export const GetChannels: FastifySchema = {
			querystring: {
				type: "object",
				properties: {
					id: { type: "string" },
					ids: {
						type: "array",
						items: { type: "string" },
					},
					reference: { type: "string" },
					orderBy: {
						type: "string",
						enum: ["id_desc", "id_asc", "reference_desc", "reference_asc", "createdAt_desc", "createdAt_asc"],
						default: "createdAt_desc",
					},
					limit: { type: "number", default: 10 },
					offset: { type: "number", default: 0 },
					source: { type: "string", enum: ["telegram", "cosmos"], default: "cosmos" },
				},
			},
		};
	}

	export namespace Document {
		export const Create: FastifySchema = {
			querystring: {
				type: "object",
				properties: {
					channelId: { type: "string" },
				},
				required: ["channelId"],
			},
		};

		export const Delete: FastifySchema = {
			params: {
				type: "object",
				properties: {
					documentId: { type: "string" },
				},
				required: ["documentId"],
			},
		};

		export const GetOne: FastifySchema = {
			params: {
				type: "object",
				properties: {
					documentId: { type: "string" },
				},
				required: ["documentId"],
			},
		};

		export const GetMany: FastifySchema = {
			querystring: {
				type: "object",
				properties: {
					id: { type: "string" },
					ids: {
						type: "array",
						items: { type: "string" },
					},
					location: { type: "string" },
					name: { type: "string" },
					mimeType: { type: "string" },
					flags: { type: "number" },
					orderBy: {
						type: "string",
						enum: ["id_desc", "id_asc", "name_desc", "name_asc", "location_desc", "location_asc", "mimeType_desc", "mimeType_asc", "createdAt_desc", "createdAt_asc", "updatedAt_desc", "updatedAt_asc"],
						default: "createdAt_desc",
					},
					limit: { type: "number", default: 10 },
					offset: { type: "number", default: 0 },
				},
			},
		};
	}

	export namespace Publish {
		export const Media: FastifySchema = {
			body: {
				type: "object",
				properties: {
					chatId: { type: "string" },
					text: { type: "string" },
					documentId: { type: "string" },
					button: {
						type: "object",
						properties: {
							text: { type: "string" },
							url: { type: "string" },
						},
					},
				},
				required: ["chatId", "text", "documentId"],
			},
		};

		export const Album: FastifySchema = {
			body: {
				type: "object",
				properties: {
					chatId: { type: "string" },
					text: { type: "string" },
					documentIds: {
						type: "array",
						items: { type: "string" },
					},
				},
				required: ["chatId", "text", "documentIds"],
			},
		};

		export const Text: FastifySchema = {
			body: {
				type: "object",
				properties: {
					chatId: { type: "string" },
					text: { type: "string" },
					button: {
						type: "object",
						properties: {
							text: { type: "string" },
							url: { type: "string" },
						},
					},
				},
				required: ["chatId", "text"],
			},
		};
	}

	export namespace Webhook {
		export const Create: FastifySchema = {
			body: {
				type: "object",
				properties: {
					channelId: { type: "string" },
					url: { type: "string" },
					token: { type: "string" },
				},
				required: ["channelId", "url", "token"],
			},
		};

		export const Delete: FastifySchema = {
			params: {
				type: "object",
				properties: {
					channelId: { type: "string" },
				},
				required: ["channelId"],
			},
		};

		export const GetOne: FastifySchema = {
			params: {
				type: "object",
				properties: {
					channelId: { type: "string" },
				},
				required: ["channelId"],
			},
		};

		export const GetMany: FastifySchema = {
			querystring: {
				type: "object",
				properties: {
					id: { type: "string" },
					ids: {
						type: "array",
						items: { type: "string" },
					},
					channelId: { type: "string" },
					orderBy: {
						type: "string",
						enum: ["id_desc", "id_asc", "channel_desc", "channel_asc", "createdAt_desc", "createdAt_asc"],
						default: "createdAt_desc",
					},
					limit: { type: "number", default: 10 },
					offset: { type: "number", default: 0 },
				},
			},
		};
	}
}

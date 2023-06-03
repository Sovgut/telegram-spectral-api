import { type FastifySchema } from "fastify";

export namespace Validations {
	export namespace Document {
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
}

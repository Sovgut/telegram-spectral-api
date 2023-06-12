import { type FastifyRegisterOptions, type FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";
import { type Request } from "~types/request.js";
import { StatusCodes } from "http-status-codes";
import { AzureStorage } from "~core/blob-storage/provider.js";
import { LocalStorage } from "~core/local-storage/provider.js";
import { StoragePathType } from "~types/blob-storage.js";
import { Validations } from "~core/http/validations.js";
import { DocumentService } from "~services/documents/class.js";
import { StorageAzure } from "~database/models/document.js";
import { Types } from "mongoose";

export class DocumentController {
	private readonly documentService = new DocumentService();

	public static async register(fastify: FastifyInstance, _opts: FastifyRegisterOptions<unknown>, done: any): Promise<void> {
		const instance = new DocumentController();

		fastify.route({
			method: "POST",
			url: "/document",
			schema: Validations.Document.Create,
			handler: instance.create.bind(instance),
		});

		fastify.route({
			method: "DELETE",
			url: "/document/:documentId",
			schema: Validations.Document.Delete,
			handler: instance.delete.bind(instance),
		});

		fastify.route({
			method: "GET",
			url: "/document/:documentId",
			schema: Validations.Document.GetOne,
			handler: instance.getOne.bind(instance),
		});

		fastify.route({
			method: "GET",
			url: "/document",
			schema: Validations.Document.GetMany,
			handler: instance.getMany.bind(instance),
		});

		done();
	}

	public async create(request: FastifyRequest<Request.Document.Create>, reply: FastifyReply): Promise<void> {
		const localStorage = new LocalStorage();
		const azureStorage = new AzureStorage();

		const fileInfo = await localStorage.write(request);
		const filename = `${fileInfo.filename}.${fileInfo.extension}`;

		const filestream = await localStorage.read(filename, StoragePathType.FileName);
		const azureResponse = await azureStorage.write(filestream, {
			fileName: filename,
			mimeType: fileInfo.mimeType,
		});
		const size = await localStorage.getSize(filename);
		await localStorage.destroy(filename);

		const document = await this.documentService.create({
			size,
			name: fileInfo.filename,
			mimeType: fileInfo.mimeType,
			location: azureResponse.url,
			flags: StorageAzure,
			channel: new Types.ObjectId(request.query.channelId),
		});

		reply.status(StatusCodes.CREATED).send({
			statusCode: StatusCodes.CREATED,
			data: document,
		});
	}

	public async getMany(request: FastifyRequest<Request.Document.GetMany>, reply: FastifyReply): Promise<void> {
		// TODO: Implement query params
		// const query: DocumentListQuery = {
		// 	id: request.query.id,
		// 	ids: request.query.ids,
		// 	name: request.query.name,
		// 	location: request.query.location,
		// 	mimeType: request.query.mimeType,
		// 	flags: request.query.flags,
		// 	orderBy: request.query.orderBy,
		// 	limit: request.query.limit,
		// 	offset: request.query.offset,
		// };

		// const [documents, count] = await Document.findMany(query);
		const documents = await this.documentService.list();

		reply.status(StatusCodes.OK).send({
			statusCode: StatusCodes.OK,
			data: documents,
		});
	}

	public async getOne(request: FastifyRequest<Request.Document.GetOne>, reply: FastifyReply): Promise<void> {
		const document = await this.documentService.read(request.params.documentId);

		reply.status(StatusCodes.OK).send({
			statusCode: StatusCodes.OK,
			data: document,
		});
	}

	public async delete(request: FastifyRequest<Request.Document.Delete>, reply: FastifyReply): Promise<void> {
		const azureStorage = new AzureStorage();
		const document = await this.documentService.read(request.params.documentId);

		await this.documentService.delete(document._id.toHexString());
		await azureStorage.destroy(document.location);

		reply.status(StatusCodes.OK).send({
			statusCode: StatusCodes.OK,
			data: "Document deleted",
		});
	}
}

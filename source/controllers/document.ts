import { type FastifyInstance, type FastifyRegisterOptions, type FastifyReply, type FastifyRequest } from "fastify";
import { type Request } from "~types/request.js";
import { type DocumentListQuery } from "~repositories/document/types.js";
import { Document } from "~repositories/document/model.js";
import { StatusCodes } from "http-status-codes";
import { AzureStorage } from "~core/blob-storage/provider.js";
import { LocalStorage } from "~core/local-storage/provider.js";
import { StoragePathType } from "~types/blob-storage.js";
import { Validations } from "~core/http/validations.js";

export class DocumentController {
  public async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
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

    const file = await Document.create({
      size,
      name: fileInfo.filename,
      mimeType: fileInfo.mimeType,
      location: azureResponse.url,
      flags: Document.StorageAzure,
    });

    reply.status(StatusCodes.CREATED).send({
      statusCode: StatusCodes.CREATED,
      data: file,
    });
  }

  public async getMany(request: FastifyRequest<Request.Document.GetMany>, reply: FastifyReply): Promise<void> {
    const query: DocumentListQuery = {
      id: request.query.id,
      ids: request.query.ids,
      name: request.query.name,
      location: request.query.location,
      mimeType: request.query.mimeType,
      flags: request.query.flags,
      orderBy: request.query.orderBy,
      limit: request.query.limit,
      offset: request.query.offset,
    };

    const [documents, count] = await Document.findMany(query);

    reply.status(StatusCodes.OK).send({
      statusCode: StatusCodes.OK,
      data: { rows: documents, count },
    });
  }

  public async getOne(request: FastifyRequest<Request.Document.GetOne>, reply: FastifyReply): Promise<void> {
    const document = await Document.findOne({
      id: request.params.documentId,
    });

    reply.status(StatusCodes.OK).send({
      statusCode: StatusCodes.OK,
      data: document,
    });
  }

  public async delete(request: FastifyRequest<Request.Document.Delete>, reply: FastifyReply): Promise<void> {
    const azureStorage = new AzureStorage();
    const document = await Document.findOne({
      id: request.params.documentId,
    });

    await Document.delete(document.id);
    await azureStorage.destroy(document.location);

    reply.status(StatusCodes.OK).send({
      statusCode: StatusCodes.OK,
      data: "Document deleted",
    });
  }
}

export const DocumentControllerRouter = (fastify: FastifyInstance, _opts: FastifyRegisterOptions<unknown>, done: any): void => {
  const controller = new DocumentController();

  fastify.route({
    method: "POST",
    url: "/document",
    handler: controller.create,
  });

  fastify.route({
    method: "DELETE",
    url: "/document/:documentId",
    schema: Validations.Document.Delete,
    handler: controller.delete,
  });

  fastify.route({
    method: "GET",
    url: "/document/:documentId",
    schema: Validations.Document.GetOne,
    handler: controller.getOne,
  });

  fastify.route({
    method: "GET",
    url: "/document",
    schema: Validations.Document.GetMany,
    handler: controller.getMany,
  });

  done();
};

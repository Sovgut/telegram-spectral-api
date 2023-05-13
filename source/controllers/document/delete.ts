import type {RouteHandler} from 'fastify'
import {StatusCodes} from 'http-status-codes'
import {Document} from 'repositories/document/model.js';
import {AzureStorage} from '~core/blob-storage/provider.js';
import {Request} from '~types/request.js';
import {NotFoundError} from "~core/errors/not-found.js";

export const DocumentDeleteController: RouteHandler<Request.Document.Delete> = async (request, reply) => {
    const document = await Document.findOne({
        id: request.params.documentId,
    });

    if (!document) {
        throw new NotFoundError('Document not found', 'document_not_found');
    }

    await Document.delete(document.id);
    await AzureStorage.delete(document.location)

    reply.status(StatusCodes.OK).send({
        statusCode: StatusCodes.OK,
        data: "Document deleted",
    });
}

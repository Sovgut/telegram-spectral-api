import type { RouteHandler } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { AzureStorage } from '../../core/blob-storage/provider.js';
import { IDocumentDelete } from '../../types/document/delete.js';

export const DocumentDeleteController: RouteHandler<IDocumentDelete> = async (request, reply) => {
    try {
        await AzureStorage.delete(request.body.url)

        reply.status(StatusCodes.OK).send({
            statusCode: StatusCodes.OK,
            message: "Document deleted",
        });
    } catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: (error as Error).message,
        });
    }
}

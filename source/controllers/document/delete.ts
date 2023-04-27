import type {RouteHandler} from 'fastify'
import {StatusCodes} from 'http-status-codes'
import {AzureBlobStorageWrapper} from '~core/blob-storage/wrapper.js';
import {IDocumentDelete} from '~types/document/delete.js';

export const DocumentDeleteController: RouteHandler<IDocumentDelete> = async (request, reply) => {
    try {
        const {url} = request.body;
        const azureStorage = new AzureBlobStorageWrapper();

        await azureStorage.delete(url)

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

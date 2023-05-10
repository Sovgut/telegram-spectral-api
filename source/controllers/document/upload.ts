import type {RouteHandler} from 'fastify'
import {StatusCodes} from 'http-status-codes'
import {AzureBlobStorageProvider} from '~core/blob-storage/provider.js';
import {LocalStorageProvider} from "~core/local-storage/provider.js";

export const DocumentUploadController: RouteHandler = async (request, reply) => {
    try {
        const azureStorage = new AzureBlobStorageProvider();
        const localStorage = new LocalStorageProvider();

        const fileInfo = await localStorage.write(request);

        if (!fileInfo) {
            return reply.status(StatusCodes.BAD_REQUEST).send({
                statusCode: StatusCodes.BAD_REQUEST,
                message: 'Document is required',
            });
        }

        const filestream = localStorage.read(`${fileInfo.filename}.${fileInfo.extension}`);
        const azureResponse = await azureStorage.write(filestream, {
            fileName: `${fileInfo.filename}.${fileInfo.extension}`,
            mimeType: fileInfo.mimeType
        });
        await localStorage.delete(`${fileInfo.filename}.${fileInfo.extension}`);

        reply.status(StatusCodes.CREATED).send({
            statusCode: StatusCodes.CREATED,
            message: {
                url: azureResponse.url,
                mimeType: azureResponse.mimeType,
                filename: azureResponse.filename,
            },
        });
    } catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: (error as Error).message,
        });
    }
}

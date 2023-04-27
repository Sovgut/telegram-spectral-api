import type { RouteHandler } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { AzureStorage } from '../../core/blob-storage/provider.js';
import { RemoteFileStream } from '../../core/files.js';

export const DocumentUploadController: RouteHandler = async (request, reply) => {
    try {
        const info = await RemoteFileStream.saveFile(request);

        if (!info) {
            return reply.status(StatusCodes.BAD_REQUEST).send({
                statusCode: StatusCodes.BAD_REQUEST,
                message: 'Document is required',
            });
        }

        const filestream = RemoteFileStream.getFileStream(info.filename);
        const azureResponse = await AzureStorage.write(filestream, info.mimeType);
        await RemoteFileStream.deleteFile(info.filename);

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

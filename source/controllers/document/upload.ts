import fs from "node:fs";
import type {RouteHandler} from 'fastify'
import {StatusCodes} from 'http-status-codes'
import {AzureStorage} from '~core/blob-storage/provider.js';
import {LocalStorage} from "~core/local-storage/provider.js";
import {Document} from 'repositories/document/model.js';
import {BadRequestError} from "~core/errors/bad-request.js";
import {Core} from "~core/namespace.js";

export const DocumentUploadController: RouteHandler = async (request, reply) => {
    const fileInfo = await LocalStorage.write(request);

    if (!fileInfo) {
        throw new BadRequestError('Document is required', 'document_required');
    }

    const filestream = LocalStorage.read(`${fileInfo.filename}.${fileInfo.extension}`, LocalStorage.StoragePathType.FileName);
    const azureResponse = await AzureStorage.write(filestream, {
        fileName: `${fileInfo.filename}.${fileInfo.extension}`,
        mimeType: fileInfo.mimeType
    });

    const stats = await fs.promises.stat(Core.Utils.rootPath(`temp/${fileInfo.filename}.${fileInfo.extension}`));

    await LocalStorage.delete(`${fileInfo.filename}.${fileInfo.extension}`);

    const file = await Document.create({
        name: fileInfo.filename,
        size: stats.size,
        mimeType: fileInfo.mimeType,
        location: azureResponse.url,
        flags: Document.StorageAzure,
    });

    reply.status(StatusCodes.CREATED).send({
        statusCode: StatusCodes.CREATED,
        data: file,
    });
}

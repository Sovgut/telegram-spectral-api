import type {RouteHandler} from 'fastify'
import {StatusCodes} from 'http-status-codes'
import {Document} from 'repositories/document/model.js';
import {Request} from '~types/request.js';
import {NotFoundError} from "~core/errors/not-found.js";

export const DocumentDetailsController: RouteHandler<Request.Document.Details> = async (request, reply) => {
    const document = await Document.findOne({
        id: request.params.documentId,
    })

    if (!document) {
        throw new NotFoundError('Document not found', 'document_not_found')
    }

    reply.status(StatusCodes.OK).send({
        statusCode: StatusCodes.OK,
        data: document,
    });
}
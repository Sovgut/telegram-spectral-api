import type {RouteHandler} from 'fastify'
import {StatusCodes} from 'http-status-codes'
import {Document} from 'repositories/document/model.js';
import {Request} from '~types/request.js';
import {DocumentListQuery} from "~repositories/document/types.js";

export const DocumentListController: RouteHandler<Request.Document.List> = async (request, reply) => {
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
    }

    const [documents, count] = await Document.findMany(query)

    reply.status(StatusCodes.OK).send({
        statusCode: StatusCodes.OK,
        data: {rows: documents, count},
    });
}
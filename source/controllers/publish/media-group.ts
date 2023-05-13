import type {RouteHandler} from 'fastify'
import {StatusCodes} from 'http-status-codes';
import {Request} from '~types/request.js';
import {Document} from "~repositories/document/model.js";
import {Telegram} from "~repositories/telegram/model.js";

export const PublishMediaGroupController: RouteHandler<Request.Publish.MediaGroup> = async (request, reply) => {
    const {chatId, text, documentIds} = request.body;

    const [documents] = await Document.findMany({ids: documentIds, limit: Number.MAX_SAFE_INTEGER, offset: 0});
    const telegramResponse = await Telegram.sendMediaGroup(chatId, text, documents);

    reply.status(StatusCodes.OK).send({
        statusCode: StatusCodes.OK,
        data: JSON.parse(telegramResponse),
    })
}

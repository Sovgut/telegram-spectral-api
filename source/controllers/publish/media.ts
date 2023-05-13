import type {RouteHandler} from 'fastify'
import {StatusCodes} from 'http-status-codes';
import {Request} from '~types/request.js';
import {Document} from "~repositories/document/model.js";
import {NotFoundError} from "~core/errors/not-found.js";
import {Core} from "~core/namespace.js";
import {Telegram} from "~repositories/telegram/model.js";

export const PublishMediaController: RouteHandler<Request.Publish.Media> = async (request, reply) => {
    const {chatId, text, documentId, button} = request.body;

    const document = await Document.findOne({id: documentId});
    if (!document) {
        throw new NotFoundError('Document not found', 'document_not_found')
    }

    let telegramResponse: any = {};
    if (Core.Utils.isPhoto(document.mimeType)) {
        telegramResponse = await Telegram.sendPhoto(chatId, text, document, button);
    } else if (Core.Utils.isVideo(document.mimeType)) {
        telegramResponse = await Telegram.sendVideo(chatId, text, document, button);
    }

    reply.status(StatusCodes.OK).send({
        statusCode: StatusCodes.OK,
        data: JSON.parse(telegramResponse),
    });
}

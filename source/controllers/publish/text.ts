import type {RouteHandler} from 'fastify'
import type {IPublishText} from '../../types/publish/text.js';
import {sendTextMessage} from '../../services/publish/text.js';
import {StatusCodes} from 'http-status-codes';
import {TextProvider} from "~services/publish/text/provider.js";

export const PublishTextController: RouteHandler<IPublishText> = async (request, reply) => {
    try {
        const {chatId, text} = request.body;
        const textProvider = new TextProvider();

        await sendTextMessage(request.body.chatId, request.body.text)

        reply.status(StatusCodes.OK).send();
    } catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: (error as Error).message,
        });
    }
}

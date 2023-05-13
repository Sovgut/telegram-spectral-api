import type {RouteHandler} from 'fastify'
import {StatusCodes} from 'http-status-codes';
import {Request} from '~types/request.js';
import {Telegram} from "~repositories/telegram/model.js";

export const PublishTextController: RouteHandler<Request.Publish.Text> = async (request, reply) => {
    const {chatId, text, button} = request.body;

    const telegramResponse = await Telegram.sendMessage(chatId, text, button);

    reply.status(StatusCodes.OK).send({
        statusCode: StatusCodes.OK,
        data: JSON.parse(telegramResponse),
    });
}

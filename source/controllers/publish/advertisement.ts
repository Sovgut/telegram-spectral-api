import type { RouteHandler } from 'fastify'
import type { IPublishAdvertisement } from '../../types/publish/advertisement.js';
import { sendAdvertisementMessage } from '../../services/publish/advertisement.js';
import { StatusCodes } from 'http-status-codes';

export const PublishAdvertisementController: RouteHandler<IPublishAdvertisement> = async (request, reply) => {
    try {
        await sendAdvertisementMessage(request.body.chatId, request.body.text, request.body.document, request.body.button)

        reply.status(StatusCodes.OK).send();
    } catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: (error as Error).message,
        });
    }
}

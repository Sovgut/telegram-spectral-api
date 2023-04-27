import type {RouteHandler} from 'fastify'
import type {IPublishAdvertisement} from '~types/publish/advertisement.js';
import {StatusCodes} from 'http-status-codes';
import {PublishAdvertisementProvider} from "~services/publish/advertisement/provider.js";

export const PublishAdvertisementController: RouteHandler<IPublishAdvertisement> = async (request, reply) => {
    try {
        const {chatId, text, document, button} = request.body;

        const advertisementProvider = new PublishAdvertisementProvider();
        await advertisementProvider.send(chatId, text, document, button)

        reply.status(StatusCodes.OK).send();
    } catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: (error as Error).message,
        });
    }
}

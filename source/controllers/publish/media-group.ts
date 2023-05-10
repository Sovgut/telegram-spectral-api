import type {RouteHandler} from 'fastify'
import type {IPublishMediaGroup} from '~types/publish/media-group.js';
import {StatusCodes} from 'http-status-codes';
import {PublishMediaGroupProvider} from "~services/publish/media-group/provider.js";

export const PublishMediaGroupController: RouteHandler<IPublishMediaGroup> = async (request, reply) => {
    try {
        const {chatId, text, documents} = request.body;
        const mediaGroupProvider = new PublishMediaGroupProvider();

        await mediaGroupProvider.send(chatId, text, documents);

        reply.status(StatusCodes.OK).send();
    } catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: (error as Error).message,
        });
    }
}

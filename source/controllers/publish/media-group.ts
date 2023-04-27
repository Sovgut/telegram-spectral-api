import type { RouteHandler } from 'fastify'
import type { IPublishMediaGroup } from '../../types/publish/media-group.js';
import { sendMediaGroupWithMessage } from '../../services/publish/media-group.js';
import { StatusCodes } from 'http-status-codes';

export const PublishMediaGroupController: RouteHandler<IPublishMediaGroup> = async (request, reply) => {
    try {
        await sendMediaGroupWithMessage(request.body.chatId, request.body.text, request.body.documents)

        reply.status(StatusCodes.OK).send();
    } catch (error) {
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: (error as Error).message,
        });
    }
}

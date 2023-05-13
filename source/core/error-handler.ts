import {BaseError} from "~core/errors/base.js";
import {FastifyError, FastifyReply, FastifyRequest} from "fastify";
import {StatusCodes} from "http-status-codes";
import {Core} from "~core/namespace.js";

export function errorHandler(error: BaseError | FastifyError | Error, request: FastifyRequest, reply: FastifyReply) {
    if (Core.Environment.isDevelopment) {
        Core.Logger.error('ErrorHandler', error);
    }

    if (error instanceof BaseError) {
        return reply.status(error.statusCode).send({
            statusCode: error.statusCode,
            error: error.message,
            key: error.key
        });
    }

    if ('validation' in error) {
        let key = 'validation_failed';
        let params: Record<string, string | string[]> = {};

        if (Array.isArray(error.validation)) {
            const validation = error.validation[0];
            const path = validation.instancePath.split('/').filter(Boolean);

            if (validation.keyword === 'required') {
                key = `${validation.params.missingProperty}_validation_failed`
            }

            if (validation.keyword === 'enum') {
                key = `${path}_validation_failed`
            }

            params = validation.params;
        }

        return reply.status(StatusCodes.BAD_REQUEST).send(Core.Utils.partial({
            statusCode: StatusCodes.BAD_REQUEST,
            error: error.message,
            key: key,
            params: Object.keys(params).length ? params : undefined
        }));
    }

    reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: error?.message,
        key: 'internal_server_error'
    });
}
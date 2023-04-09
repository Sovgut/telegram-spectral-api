import type {NextFunction, Request, Response} from 'express'
import {Logger} from '~core/logger.js'
import {extractError} from '~core/utils/extract-error.js'

export function errorMiddleware (error: unknown, request: Request, response: Response, _next: NextFunction) {
    const {httpStatus, key} = extractError(error)
    const logger = new Logger('ErrorMiddleware')

    logger.error(`HTTP ${httpStatus} ${request.method} ${request.url}`)

    if (request.body) {
        logger.error(`Body: ${JSON.stringify(request.body)}`)
    }

    if (request.query) {
        logger.error(`Query: ${JSON.stringify(request.query)}`)
    }

    if (request.params) {
        logger.error(`Params: ${JSON.stringify(request.params)}`)
    }

    if (error instanceof Error) {
        logger.error(error.message)
    }

    response.status(httpStatus).json({key})
}

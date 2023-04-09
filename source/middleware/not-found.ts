import type {NextFunction, Request, Response} from 'express'
import {StatusCodes} from 'http-status-codes'
import {NOT_FOUND} from '~core/constants.js'

export function notFoundMiddleware (_request: Request, response: Response, _next: NextFunction) {
    response.status(StatusCodes.NOT_FOUND).json({key: NOT_FOUND})
}

import {Config} from 'core/config.js'
import type {NextFunction, Request, Response} from 'express'
import {StatusCodes} from 'http-status-codes'
import {HEADER_AUTH_SECRET_KEY} from '~core/constants.js'

export function authorizationMiddleware (request: Request, response: Response, next: NextFunction) {
    const secret = request.headers[HEADER_AUTH_SECRET_KEY] as string

    if (secret === Config.ApplicationSecret) {
        next()
    } else {
        response.status(StatusCodes.UNAUTHORIZED).end()
    }
}

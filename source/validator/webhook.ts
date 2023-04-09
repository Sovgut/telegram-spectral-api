import type {NextFunction, Request, Response} from 'express'
import {HIDDEN_HOSTNAME, SECRET_IS_EMPTY_OR_UNDEFINED, URL_IS_EMPTY_OR_UNDEFINED} from '~core/constants.js'
import {BadRequestError} from '~core/error/bad-request.js'

export class WebhookValidator {
    static createWebhook (request: Request, _response: Response, next: NextFunction) {
        try {
            const {url, secret} = request.body
            const host = request.headers.host

            if (typeof host !== 'string') {
                throw new BadRequestError('Hidden hostname', HIDDEN_HOSTNAME)
            }

            if (typeof url !== 'string') {
                throw new BadRequestError('Url is empty or undefined', URL_IS_EMPTY_OR_UNDEFINED)
            }

            if (typeof secret !== 'string') {
                throw new BadRequestError('Secret is empty or undefined', SECRET_IS_EMPTY_OR_UNDEFINED)
            }

            next()
        } catch (error) {
            next(error)
        }
    }

    static getWebhook (request: Request, _response: Response, next: NextFunction) {
        try {
            const host = request.headers.host

            if (typeof host !== 'string') {
                throw new BadRequestError('Hidden hostname', HIDDEN_HOSTNAME)
            }

            next()
        } catch (error) {
            next(error)
        }
    }
}

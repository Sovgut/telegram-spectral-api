import type {NextFunction, Request, Response} from 'express'
import {StatusCodes} from 'http-status-codes'
import {WebhookService} from '~service/webhook.js'

export class WebhookController {
    static async createWebhook (request: Request, response: Response, next: NextFunction) {
        try {
            const {url, secret} = request.body
            const host = request.headers.host as string
            const service = new WebhookService()

            await service.create({host, url, secret})

            response.status(StatusCodes.OK).end()
        } catch (error) {
            next(error)
        }
    }

    static async getWebhook (request: Request, response: Response, next: NextFunction) {
        try {
            const host = request.headers.host as string

            const service = new WebhookService()
            const record = await service.getOne(host)

            response.status(StatusCodes.OK).json(record)
        } catch (error) {
            next(error)
        }
    }
}

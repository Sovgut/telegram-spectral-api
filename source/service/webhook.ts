import {WEBHOOK_NOT_FOUND} from '~core/constants.js'
import {NotFoundError} from '~core/error/not-found.js'
import {ICreateWebhook, WebhookRepository} from '~repository/webhook.js'

export class WebhookService {
    #repository = new WebhookRepository()

    async create (data: ICreateWebhook) {
        const record = await this.#repository.create(data)

        return {host: record.host, url: record.url, retries: record.retries}
    }

    async getOne (host: string) {
        const record = await this.#repository.getOne(host)

        if (!record) {
            throw new NotFoundError('Webhook not found', WEBHOOK_NOT_FOUND)
        }

        return {host: record.host, url: record.url, retries: record.retries}
    }

    /**
     * Increment webhook retries
     * Delete webhook if retries is greater than 5
     * Does nothing if webhook not found
     */
    async incrementRetry (host: string) {
        let record = await this.#repository.getOne(host)

        if (!record) return
        if (record.retries >= 5) {
            return await this.#repository.delete(host)
        }

        record = await this.#repository.update(host, {retries: record.retries + 1})
        
        return {host: record.host, url: record.url, retries: record.retries}
    }
}

import {Connection} from '~core/database.js'

export interface ICreateWebhook {
    host: string
    url: string
    secret: string
}

export interface IUpdateWebhook {
    retries: number
}

export class WebhookRepository {
    #database = Connection.Database

    async create (data: ICreateWebhook) {
        const record = await this.#database.webhook.create({data: {host: data.host, url: data.url, secret: data.secret}})

        return record
    }

    async update (host: string, data: IUpdateWebhook) {
        const record = await this.#database.webhook.update({where: {host}, data: {retries: data.retries}})

        return record
    }

    async delete (host: string) {
        const record = await this.#database.webhook.delete({where: {host}})
        
        return record
    }

    async getOne (host: string) {
        const record = await this.#database.webhook.findUnique({where: {host}})

        return record
    }

    async getAll () {
        const records = await this.#database.webhook.findMany()
        
        return records
    }
}

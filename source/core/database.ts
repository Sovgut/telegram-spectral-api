import {PrismaClient} from '@prisma/client'

export class Connection {
    static #database: PrismaClient | null = null

    static get Database () {
        if (Connection.#database instanceof PrismaClient) {
            return Connection.#database
        }

        return (Connection.#database = new PrismaClient())
    }
}
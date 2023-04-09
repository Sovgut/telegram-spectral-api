import dotenv from 'dotenv'
import {Logger} from '~core/logger.js'
import {getRelativeFilePath} from '~core/utils/file-system/get-relative-path.js'

export class Config {
    static #logger = new Logger('Config')

    static {
        const output = dotenv.config({path: getRelativeFilePath(import.meta.url, '3|.env')})

        if (output.parsed) {
            Config.#logger.debug('loaded local environment variables')
        }
    }

    static get ApplicationPort () {
        const port = parseInt(process.env.APP_PORT as string, 10)

        if (isNaN(port)) {
            Config.#logger.error('APP_PORT environment variable is required and must be a number')
            process.exit(1)
        }

        return port
    }

    static get ApplicationLogLevel () {
        const logLevel = process.env.APP_LOG_LEVEL as string

        if (!['LOG', 'ERROR', 'WARN', 'DEBUG'].includes(logLevel)) {
            Config.#logger.warn('APP_LOG_LEVEL environment variable is not found and must be one of LOG, ERROR, WARN, DEBUG')
            Config.#logger.warn('Using default value: DEBUG')

            return 'DEBUG'
        }

        return logLevel
    }

    static get ApplicationSecret () {
        const secret = process.env.APP_SECRET as string

        if (!secret) {
            Config.#logger.error('APP_SECRET environment variable is required')
            process.exit(1)
        }

        return secret
    }

    static get TelegramBotToken () {
        const token = process.env.TELEGRAM_BOT_TOKEN as string

        if (!token) {
            Config.#logger.error('TELEGRAM_BOT_TOKEN environment variable is required')
            process.exit(1)
        }

        return token
    }
}

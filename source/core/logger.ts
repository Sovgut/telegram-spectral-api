import chalk from 'chalk'
import {LOG_LEVELS} from '~core/constants.js'

export class Logger {
    #namespace: string

    /**
     * @param namespace The namespace of the logger.
     */
    constructor (namespace: string) {
        this.#namespace = namespace
    }

    /**
     * Get the logger level from the environment variable APP_LOG_LEVEL.
     * If the environment variable is not set, the default level is DEBUG.
     */
    #loggerLevel (): number {
        const level = process.env.APP_LOG_LEVEL as unknown as keyof typeof LOG_LEVELS

        if (level in LOG_LEVELS) {
            return LOG_LEVELS[level]
        }

        return LOG_LEVELS.DEBUG
    }

    /**
     * Log a message to the console.
     *
     * @param message The message to log.
     *
     * @example
     * const logger = new Logger('Router')
     *
     * logger.log('started')
     * // [Router] started
     */
    log (message: unknown) {
        console.log(`[${chalk.white(this.#namespace)}]`, message)
    }

    /**
     * Log an error to the console.
     *
     * @param message The error to log.
     *
     * @example
     * const logger = new Logger('Router')
     *
     * logger.error('failed to start')
     * // [Router] failed to start
     */
    error (message: unknown) {
        if (this.#loggerLevel() < LOG_LEVELS.ERROR) return

        console.error(`[${chalk.red(this.#namespace)}]`, message)
    }

    /**
     * Log a warning to the console.
     *
     * @param message The warning to log.
     *
     * @example
     * const logger = new Logger('Router')
     *
     * logger.warn('failed to start')
     * // [Router] failed to start
     */
    warn (message: unknown) {
        if (this.#loggerLevel() < LOG_LEVELS.WARN) return

        console.warn(`[${chalk.yellow(this.#namespace)}]`, message)
    }

    /**
     * Log a debug message to the console.
     *
     * @param message The debug message to log.
     *
     * @example
     * const logger = new Logger('Router')
     *
     * logger.debug('started')
     * // [Router] started
     */
    debug (message: unknown) {
        if (this.#loggerLevel() < LOG_LEVELS.DEBUG) return

        console.log(`[${chalk.cyan(this.#namespace)}]`, message)
    }
}

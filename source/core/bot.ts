import {Telegraf, Input} from 'telegraf'
import {Config} from '~core/config.js'
import {Logger} from '~core/logger.js'

export class TelegramBotManager {
    #logger = new Logger('TelegramBotManager')
    #bot = new Telegraf(Config.TelegramBotToken)

    /**
     * Initialize the Telegram bot manager.
     * Bot gracefully stops on SIGINT and SIGTERM.
     */
    constructor () {
        this.#bot.launch()

        process.once('SIGINT', () => this.#bot.stop('SIGINT'))
        process.once('SIGTERM', () => this.#bot.stop('SIGTERM'))

        this.#logger.debug('started')
    }

    /**
     * Send a message to a channel.
     * 
     * @param channelId The channel id.
     */
    async sendMessage (channelId: number) {
        try {
            const files: Array<{path: string; type: 'video' | 'photo', caption: string}> = [
                {path: 'https://i.imgur.com/UQxYwm7.mp4', type: 'video', caption: 'Se fueron años de crecimiento.'}, 
                {path: 'https://i.imgur.com/nq9Dl8I.mp4', type: 'video', caption: 'I would have left a trail of sh*t behind as i panic swim away.'}
            ]

            await this.#bot.telegram.sendMediaGroup(channelId, files.map(file => ({
                media: Input.fromURL(file.path),
                type: file.type,
                caption: file.caption
            })))

        } catch (error) {
            if (error instanceof Error) {
                this.#logger.error(error.message)
            }
        }
    }
}

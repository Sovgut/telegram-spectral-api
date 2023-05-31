import Fastify, {type FastifyInstance} from 'fastify'
import FastifyMultipart from '@fastify/multipart'
import {Telegraf} from 'telegraf'
import {PublishMediaController} from '~controllers/publish/media.js'
import {PublishMediaGroupController} from '~controllers/publish/media-group.js'
import {PublishTextController} from '~controllers/publish/text.js'
import {DocumentUploadController} from '~controllers/document/upload.js'
import {DocumentDeleteController} from '~controllers/document/delete.js'
import {TelegramConnectionProvider} from '~core/telegram/connection.js'
import {DocumentDetailsController} from '~controllers/document/details.js'
import {DocumentListController} from '~controllers/document/list.js'
import {Validations} from './validations.js'
import {errorHandler} from '~core/error-handler.js'
import {Core} from '~core/namespace.js'

export class App {
  public static server: FastifyInstance
  public static bot: Telegraf
  public static telegram: TelegramConnectionProvider

  static {
    App.server = Fastify({logger: false})
    App.server.setErrorHandler(errorHandler)
    App.server.register(FastifyMultipart)

    App.bot = new Telegraf(Core.Environment.telegramBotToken)
    App.telegram = new TelegramConnectionProvider()

    App.server.route({
      method: 'POST',
      url: '/document',
      handler: DocumentUploadController
    })

    App.server.route({
      method: 'DELETE',
      url: '/document/:documentId',
      schema: Validations.Document.Delete,
      handler: DocumentDeleteController
    })

    App.server.route({
      method: 'GET',
      url: '/document/:documentId',
      schema: Validations.Document.Details,
      handler: DocumentDetailsController
    })

    App.server.route({
      method: 'GET',
      url: '/document',
      schema: Validations.Document.List,
      handler: DocumentListController
    })

    App.server.route({
      method: 'POST',
      url: '/publish/media',
      schema: Validations.Publish.Media,
      handler: PublishMediaController
    })

    App.server.route({
      method: 'POST',
      url: '/publish/media-group',
      schema: Validations.Publish.MediaGroup,
      handler: PublishMediaGroupController
    })

    App.server.route({
      method: 'POST',
      url: '/publish/text',
      schema: Validations.Publish.Text,
      handler: PublishTextController
    })

    App.server.listen({port: Core.Environment.appPort}, async (error: Error | null, address: string) => {
      if (error != null) {
        Core.Logger.error('Server', error.message)
        process.exit(1)
      }

      Core.Logger.info('Server', `Listening on ${address}`)
      await App.bot.launch()
    })
  }
}

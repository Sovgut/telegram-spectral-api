import Fastify, {FastifyInstance} from 'fastify';
import FastifyMultipart from '@fastify/multipart';
import {Telegraf} from 'telegraf'
import {Environment} from '~core/config.js';
import {PublishAdvertisementValidationSchema} from '~validations/publish/advertisement.js';
import {PublishAdvertisementController} from '~controllers/publish/advertisement.js';
import {PublishMediaGroupValidationSchema} from '~validations/publish/media-group.js';
import {PublishMediaGroupController} from '~controllers/publish/media-group.js';
import {PublishTextValidationSchema} from '~validations/publish/text.js';
import {PublishTextController} from '~controllers/publish/text.js';
import {DocumentUploadController} from '~controllers/document/upload.js';
import {DocumentDeleteController} from '~controllers/document/delete.js';
import {DocumentDeleteValidationSchema} from '~validations/document/delete.js';

export class App {
    public static server: FastifyInstance;
    public static bot: Telegraf;

    static {
        App.server = Fastify({logger: true});
        App.server.register(FastifyMultipart);

        App.bot = new Telegraf(Environment.telegramToken);

        App.server.route({
            method: 'POST',
            url: '/upload/document',
            handler: DocumentUploadController
        });

        App.server.route({
            method: 'DELETE',
            url: '/upload/document',
            schema: DocumentDeleteValidationSchema,
            handler: DocumentDeleteController
        });

        App.server.route({
            method: 'POST',
            url: '/publish/advertisement',
            schema: PublishAdvertisementValidationSchema,
            handler: PublishAdvertisementController
        });

        App.server.route({
            method: 'POST',
            url: '/publish/media-group',
            schema: PublishMediaGroupValidationSchema,
            handler: PublishMediaGroupController
        });

        App.server.route({
            method: 'POST',
            url: '/publish/text',
            schema: PublishTextValidationSchema,
            handler: PublishTextController
        });

        App.server.listen({port: Environment.appPort}, async (error: Error | null, address: string) => {
            if (error) {
                App.server.log.error(error);
                process.exit(1);
            }

            App.server.log.info(`server listening on ${address}`);
            await App.bot.launch();
        });
    }
}

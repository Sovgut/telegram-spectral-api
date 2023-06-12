import Fastify from "fastify";
import FastifyMultipart from "@fastify/multipart";
import { Config } from "~core/config/class.js";
import { TelegramConnectionProvider } from "~core/telegram/connection.js";
import { DocumentController } from "~controllers/document.js";
import { ChannelController } from "~controllers/channel.js";
import { PublishController } from "~controllers/publish.js";
import { WebhookController } from "~controllers/webhook.js";
import { Http } from "~core/http/class.js";
import { HealthController } from "~controllers/health.js";

const server = Fastify({ logger: false });
const http = new Http();

server.setErrorHandler(http.errorHandler.bind(http));
server.register(FastifyMultipart);
server.addHook("onRequest", http.requestLogger.bind(http));

// This is a health check endpoint and should be available without authorization
server.register(HealthController.register);

server.addHook("onRequest", http.requestAuthorization.bind(http));
server.register(DocumentController.register);
server.register(PublishController.register);
server.register(ChannelController.register);
server.register(WebhookController.register);

server.listen({ host: Config.App.Host, port: Config.App.Port }, http.onServerStart.bind(http));

export const telegramClient = new TelegramConnectionProvider();

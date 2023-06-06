import Fastify from "fastify";
import FastifyMultipart from "@fastify/multipart";
import { Config } from "~core/config/class.js";
import { TelegramConnectionProvider } from "~core/telegram/connection.js";
import { errorHandler } from "~core/http/error-handler.js";
import { onServerStart } from "~core/http/hooks.js";
import { requestLogger } from "~core/http/request-logger.js";
import { requestAuthorization } from "~core/http/request-authorization.js";
import { DocumentController } from "~controllers/document.js";
import { ChannelController } from "~controllers/channel.js";
import { PublishController } from "~controllers/publish.js";
import { WebhookController } from "~controllers/webhook.js";

const server = Fastify({ logger: false });

server.setErrorHandler(errorHandler);
server.register(FastifyMultipart);
server.addHook("onRequest", requestLogger);
server.addHook("onRequest", requestAuthorization);
server.register(DocumentController.register);
server.register(PublishController.register);
server.register(ChannelController.register);
server.register(WebhookController.register);

server.listen({ host: "127.0.0.1", port: Config.App.Port }, onServerStart);

export const telegramClient = new TelegramConnectionProvider();

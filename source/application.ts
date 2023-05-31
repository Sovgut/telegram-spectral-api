import "~core/boot.js";
import Fastify from "fastify";
import FastifyMultipart from "@fastify/multipart";
import { TelegramConnectionProvider } from "~core/telegram/connection.js";
import { errorHandler } from "~core/http/error-handler.js";
import { DocumentControllerRouter } from "~controllers/document.js";
import { PublishControllerRouter } from "~controllers/publish.js";
import { onServerStart } from "~core/http/hooks.js";
import { Config } from "~core/config/class.js";
import { requestLogger } from "~core/http/request-logger.js";

const server = Fastify({ logger: false });

server.setErrorHandler(errorHandler);
server.register(FastifyMultipart);
server.addHook("onRequest", requestLogger);
server.register(DocumentControllerRouter);
server.register(PublishControllerRouter);

server.listen({ port: Config.appPort() }, onServerStart);

export const telegramClient = new TelegramConnectionProvider();

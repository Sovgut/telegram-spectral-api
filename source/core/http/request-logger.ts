import { type FastifyReply, type FastifyRequest } from "fastify";
import { Logger } from "~core/logger.js";

export function requestLogger(request: FastifyRequest, reply: FastifyReply, done: (error?: Error | undefined) => void): unknown {
  const logger = new Logger();

  logger.log({
    scope: "http:middleware:requestLogger",
    message: "Request received",
    method: request.method,
    url: request.url,
    params: request.params,
    query: request.query,
    body: request.body,
  });

  return done();
}

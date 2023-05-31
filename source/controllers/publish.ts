import { type FastifyInstance, type FastifyRegisterOptions, type FastifyReply, type FastifyRequest } from "fastify";
import { type Request } from "~types/request.js";
import { Document } from "~repositories/document/model.js";
import { Core } from "~core/namespace.js";
import { Telegram } from "~repositories/telegram/model.js";
import { StatusCodes } from "http-status-codes";
import { Validations } from "~core/http/validations.js";

export class PublishController {
  private readonly telegram = new Telegram();

  public async media(request: FastifyRequest<Request.Publish.Media>, reply: FastifyReply): Promise<void> {
    const { chatId, text, documentId, button } = request.body;

    const document = await Document.findOne({ id: documentId });

    let telegramResponse: any = {};
    if (Core.Utils.isPhoto(document.mimeType)) {
      telegramResponse = await this.telegram.sendPhoto(chatId, text, document, button);
    } else if (Core.Utils.isVideo(document.mimeType)) {
      telegramResponse = await this.telegram.sendVideo(chatId, text, document, button);
    }

    reply.status(StatusCodes.OK).send({
      statusCode: StatusCodes.OK,
      data: JSON.parse(telegramResponse),
    });
  }

  public async album(request: FastifyRequest<Request.Publish.Album>, reply: FastifyReply): Promise<void> {
    const { chatId, text, documentIds } = request.body;

    const [documents] = await Document.findMany({
      ids: documentIds,
      limit: Number.MAX_SAFE_INTEGER,
      offset: 0,
    });
    const telegramResponse = await this.telegram.sendAlbum(chatId, text, documents);

    reply.status(StatusCodes.OK).send({
      statusCode: StatusCodes.OK,
      data: JSON.parse(telegramResponse),
    });
  }

  public async text(request: FastifyRequest<Request.Publish.Text>, reply: FastifyReply): Promise<void> {
    const { chatId, text, button } = request.body;

    const telegramResponse = await this.telegram.sendMessage(chatId, text, button);

    reply.status(StatusCodes.OK).send({
      statusCode: StatusCodes.OK,
      data: JSON.parse(telegramResponse),
    });
  }
}

export const PublishControllerRouter = (fastify: FastifyInstance, _opts: FastifyRegisterOptions<unknown>, done: any): void => {
  const controller = new PublishController();

  fastify.route({
    method: "POST",
    url: "/publish/media",
    schema: Validations.Publish.Media,
    handler: controller.media,
  });

  fastify.route({
    method: "POST",
    url: "/publish/media-group",
    schema: Validations.Publish.Album,
    handler: controller.album,
  });

  fastify.route({
    method: "POST",
    url: "/publish/text",
    schema: Validations.Publish.Text,
    handler: controller.text,
  });

  done();
};

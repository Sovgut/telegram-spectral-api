import {PublishOptions} from "~types/telegram.js";
import {PublishTextMessage} from "~core/telegram/kind/text-message.js";
import {PublishAdvertisementMessage} from "~core/telegram/kind/advertisement-message.js";
import {PublishMediaGroupMessage} from "~core/telegram/kind/media-group.js";

export class TelegramPublishProvider {
    public async publish(chatId: string, options: PublishOptions) {
        if (options.kind === PublishTextMessage.kind) {
            await new PublishTextMessage(options).publish(chatId);
        }

        if (options.kind === PublishAdvertisementMessage.kind) {
            await new PublishAdvertisementMessage(options).publish(chatId);
        }

        if (options.kind === PublishMediaGroupMessage.kind) {
            await new PublishMediaGroupMessage(options).publish(chatId);
        }
    }
}

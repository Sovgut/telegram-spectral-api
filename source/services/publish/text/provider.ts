import {App} from "~application";

export class PublishTextProvider {
    public async send(chatId: string, text: string) {
        await App.bot.telegram.sendMessage(chatId, text, {
            parse_mode: 'HTML'
        });
    }
}
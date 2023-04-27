import { App } from "../../main.js";

export async function sendTextMessage(chatId: string, text: string) {
    await App.bot.telegram.sendMessage(chatId, text, {
        parse_mode: 'HTML'
    });
}

import { nanoid } from "nanoid";
import { AzureStorage } from "../../../core/blob-storage/provider.js";
import { extractThumbnail } from "../../../core/local-storage/extract-thumbnail.js";
import { RemoteFileStream } from "../../../core/files.js";
import { getFilenameFromUrl } from "../../../core/utils/get-filename.js";
import { App } from "../../main.js";
import type { IButton, IDocument } from "../../../types/entities.js";

export async function sendAdvertisementMessage(chatId: string, text: string, document: IDocument, button: IButton) {
    await AzureStorage.read(document.url)

    const filestream = RemoteFileStream.getFileStreamFromUrl(document.url);
    if (document.type === 'photo') {
        await App.bot.telegram.sendPhoto(chatId, { source: filestream }, {
            caption: text,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [[
                    { text: button.text, url: button.url },
                ]]
            }
        });
    }

    if (document.type === 'video') {
        const filename = getFilenameFromUrl(document.url);
        const thumbnail = await extractThumbnail(filename, nanoid());
        const thumbstream = RemoteFileStream.getFileStream(thumbnail.filename);

        await App.bot.telegram.sendVideo(chatId, { source: filestream }, {
            caption: text,
            thumb: { source: thumbstream },
            width: thumbnail.width,
            height: thumbnail.height,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [[
                    { text: button.text, url: button.url },
                ]]
            }
        });

        await RemoteFileStream.deleteFile(thumbnail.filename);
    }

    await AzureStorage.delete(document.url);
    await RemoteFileStream.deleteFileFromUrl(document.url);
}

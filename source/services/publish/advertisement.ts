import {nanoid} from "nanoid";
import {App} from "~application";
import {AzureBlobStorageWrapper} from "~core/blob-storage/wrapper.js";
import {extractThumbnail} from "~core/local-storage/extract-thumbnail.js";
import {extractFilename} from "~core/utils/extract-filename.js";
import type {IButton, IDocument} from "~types/entities.js";
import {LocalStorageWrapper} from "~core/local-storage/wrapper.js";
import {LocalStorageProvider} from "~core/local-storage/provider.js";

export async function sendAdvertisementMessage(chatId: string, text: string, document: IDocument, button: IButton) {
    const azureStorageWrapper = new AzureBlobStorageWrapper();
    const localStorageWrapper = new LocalStorageWrapper();
    const localStorageProvider = new LocalStorageProvider();

    /**
     * Download file from Azure Blob Storage to local storage
     */
    await azureStorageWrapper.read(document.url);

    /**
     * Create file stream from local storage
     */
    const fileStream = localStorageWrapper.read(document.url);

    if (document.type === 'photo') {
        await App.bot.telegram.sendPhoto(chatId, {source: fileStream}, {
            caption: text,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [[
                    {text: button.text, url: button.url},
                ]]
            }
        });
    }

    if (document.type === 'video') {
        const filename = extractFilename(document.url);

        /**
         * Extract thumbnail from video and save it to local storage
         */
        const thumbnail = await extractThumbnail(filename, nanoid());
        const thumbStream = localStorageProvider.read(thumbnail.filename);

        await App.bot.telegram.sendVideo(chatId, {source: fileStream}, {
            caption: text,
            thumb: {source: thumbStream},
            width: thumbnail.width,
            height: thumbnail.height,
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [[
                    {text: button.text, url: button.url},
                ]]
            }
        });

        /**
         * Delete thumbnail from local storage
         */
        await localStorageProvider.delete(thumbnail.filename);
    }

    /**
     * Delete file from local storage and Azure Blob Storage
     */
    await localStorageWrapper.delete(document.url);
    await azureStorageWrapper.delete(document.url);
}

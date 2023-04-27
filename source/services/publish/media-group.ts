import { Types } from "telegraf";
import { App } from "../../main.js";
import type { IDocument } from "../../../types/entities.js";
import { AzureStorage } from "../../../core/blob-storage/provider.js";
import { RemoteFileStream } from "../../../core/files.js";
import { getFilenameFromUrl } from "../../../core/utils/get-filename.js";
import { extractThumbnail } from "../../../core/local-storage/extract-thumbnail.js";
import { nanoid } from "nanoid";

export async function sendMediaGroupWithMessage(chatId: string, text: string, documents: IDocument[]) {
    if (documents.length === 0) return

    const preparingDocuments = []

    for (let index = 0; index < documents.length; index += 1) {
        await AzureStorage.read(documents[index].url);

        if (index === 0) {
            if (documents[index].type === 'photo') {
                preparingDocuments.push({
                    photo: {
                        type: documents[index].type,
                        media: { source: RemoteFileStream.getFileStreamFromUrl(documents[index].url) },
                        caption: text,
                        parse_mode: 'HTML'
                    }
                })
            }

            if (documents[index].type === 'video') {
                const filename = getFilenameFromUrl(documents[index].url);
                const thumbnail = await extractThumbnail(filename, nanoid());

                preparingDocuments.push({
                    type: documents[index].type,
                    media: { source: RemoteFileStream.getFileStreamFromUrl(documents[index].url) },
                    width: thumbnail.width,
                    height: thumbnail.height,
                    thumb: { source: RemoteFileStream.getFileStream(thumbnail.filename) },
                    __thumbfilename: thumbnail.filename,
                    caption: text,
                    parse_mode: 'HTML'
                })
            }
        } else {
            if (documents[index].type === 'photo') {
                preparingDocuments.push({
                    type: documents[index].type,
                    media: { source: RemoteFileStream.getFileStreamFromUrl(documents[index].url) },
                })
            }

            if (documents[index].type === 'video') {
                const filename = getFilenameFromUrl(documents[index].url);
                const thumbnail = await extractThumbnail(filename, nanoid());

                preparingDocuments.push({
                    type: documents[index].type,
                    media: { source: RemoteFileStream.getFileStreamFromUrl(documents[index].url) },
                    width: thumbnail.width,
                    height: thumbnail.height,
                    thumb: { source: RemoteFileStream.getFileStream(thumbnail.filename) },
                    __thumbfilename: thumbnail.filename,
                })
            }
        }
    }

    await App.bot.telegram.sendMediaGroup(chatId, preparingDocuments as Types.MediaGroup);

    for (let index = 0; index < documents.length; index += 1) {
        await AzureStorage.delete(documents[index].url);
        await RemoteFileStream.deleteFileFromUrl(documents[index].url);

        if (documents[index].type === 'video') {
            if (preparingDocuments[index] && '__thumbfilename' in preparingDocuments[index] && typeof preparingDocuments[index].__thumbfilename === 'string') {
                await RemoteFileStream.deleteFile(preparingDocuments[index].__thumbfilename as string);
            }
        }
    }
}


// Yes, you can add a caption to the first media in the `sendMediaGroup` request by including a `caption` property in the first object of the `fileIds` array. Here's an example of how you can modify your code to include a caption:

// ```javascript
// const chatId = '@yourchannel';
// const media = [
//     {type: 'photo', media: {source: fs.createReadStream('/path/to/photo1.jpg')}},
//     {type: 'photo', media: {source: fs.createReadStream('/path/to/photo2.jpg')}},
//     {
//         type: 'video',
//         media: {source: fs.createReadStream('/path/to/video.mp4')},
//         thumb: {source: fs.createReadStream('/path/to/thumbnail.jpg')}
//     }
// ];

// const tempMessages = await Promise.all(media.map(async item => {
//     if (item.type === 'photo') {
//         return ctx.telegram.sendPhoto(chatId, item.media);
//     } else if (item.type === 'video') {
//         const thumbMessage = await ctx.telegram.sendPhoto(chatId, item.thumb);
//         const videoMessage = await ctx.telegram.sendVideo(chatId, item.media, {thumb: thumbMessage.photo[0].file_id});
//         return {videoMessage, thumbMessage};
//     }
// }));

// const fileIds = tempMessages.map((message, index) => {
//     if (media[index].type === 'photo') {
//         return {type: 'photo', media: message.photo[0].file_id};
//     } else if (media[index].type === 'video') {
//         return {type: 'video', media: message.videoMessage.video.file_id};
//     }
// });

// fileIds[0].caption = "Your caption here";

// await Promise.all(tempMessages.flatMap(message => {
//     if (message.photo) {
//         return ctx.telegram.deleteMessage(chatId, message.message_id);
//     } else if (message.videoMessage) {
//         return [
//             ctx.telegram.deleteMessage(chatId, message.videoMessage.message_id),
//             ctx.telegram.deleteMessage(chatId, message.thumbMessage.message_id)
//         ];
//     }
// }));

// ctx.telegram.sendMediaGroup(chatId, fileIds);
// ```

// This code adds a `caption` property to the first object in the `fileIds` array. The value of the `caption` property is the text that will be displayed as the caption for the first media in the `sendMediaGroup` request.
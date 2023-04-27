import type { IButton, IDocument } from "../entities.js"

export interface IPublishAdvertisement {
    Body: {
        chatId: string,
        text: string,
        document: IDocument,
        button: IButton
    }
}
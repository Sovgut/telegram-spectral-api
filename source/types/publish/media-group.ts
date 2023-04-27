import type { IDocument } from "../entities.js"

export interface IPublishMediaGroup {
    Body: {
        chatId: string,
        text: string,
        documents: IDocument[]
    }
}

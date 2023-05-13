export namespace Request {
    export namespace Document {
        export interface Delete {
            Params: {
                documentId: string,
            }
        }

        export interface Details {
            Params: {
                documentId: string,
            }
        }

        export interface List {
            Querystring: {
                id?: string,
                ids?: string[],
                location?: string,
                name?: string,
                mimeType?: string,
                flags?: number,
                orderBy?: string,
                limit: number,
                offset: number,
            }
        }
    }

    export namespace Publish {
        export interface Media {
            Body: {
                chatId: string,
                text: string,
                documentId: string,
                button?: { url: string, text: string }
            }
        }

        export interface MediaGroup {
            Body: {
                chatId: string,
                text: string,
                documentIds: string[],
            }
        }

        export interface Text {
            Body: {
                chatId: string,
                text: string,
                button?: { url: string, text: string }
            }
        }
    }
}
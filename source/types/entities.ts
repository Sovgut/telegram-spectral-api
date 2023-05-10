import internal from "node:stream";

export interface IDocument {
    type: 'photo' | 'video'
    url: string
}

export interface IButton {
    text: string
    url: string
}

export interface IMedia {
    source: internal.Readable;
    filename: string;
}

export interface IVideoInputOptions {
    caption?: string;
    media: IMedia;
}

export interface IPhotoInputOptions {
    caption?: string;
    media: IMedia;
}

export interface ITelegramFile {
    photo: Array<{ file_id: string }>
    video: {
        file_id: string,
        thumb?: {
            file_id: string
        }
    }
}
import internal from "node:stream";

export interface IDocument {
    type: 'photo' | 'video'
    url: string
}

export interface IButton {
    text: string
    url: string
}

export interface IThumbnail {
    source: internal.Readable;
    filename: string;
}

export interface IMedia {
    source: internal.Readable;
    filename: string;
}

export interface IVideoInputOptions {
    caption?: string;
    width?: number;
    height?: number;
    thumb: IThumbnail | string;
    media: IMedia;
}

export interface IPhotoInputOptions {
    caption?: string;
    media: IMedia;
}
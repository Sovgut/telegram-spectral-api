import {IMedia, IThumbnail, IVideoInputOptions} from "~types/entities.js";

export class VideoInput {
    public readonly type: 'video' = 'video';
    public readonly caption?: string;
    public readonly width?: number;
    public readonly height?: number;
    public readonly media: IMedia;
    public readonly thumb: IThumbnail | string;

    constructor(options: IVideoInputOptions) {
        this.caption = options.caption;
        this.width = options.width;
        this.height = options.height;
        this.media = options.media;
        this.thumb = options.thumb;
    }
}
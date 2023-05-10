import {IMedia, IVideoInputOptions} from "~types/entities.js";

export class VideoInput {
    public readonly type: 'video' = 'video';
    public readonly parse_mode: 'HTML' = 'HTML';
    public readonly caption?: string;
    public readonly media: IMedia;

    constructor(options: IVideoInputOptions) {
        this.caption = options.caption;
        this.media = options.media;
    }
}
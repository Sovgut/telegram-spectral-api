import {IMedia, IPhotoInputOptions} from "~types/entities.js";

export class PhotoInput {
    public readonly type: 'photo' = 'photo';
    public readonly parse_mode: 'HTML' = 'HTML';
    public readonly caption?: string;
    public readonly media: IMedia;

    constructor(options: IPhotoInputOptions) {
        this.caption = options.caption;
        this.media = options.media;
    }
}
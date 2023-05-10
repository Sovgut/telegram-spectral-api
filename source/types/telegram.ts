export interface IPublishTextMessage {
    kind: 'text';
    text: string;
}

export interface IPublishMediaMessage {
    kind: 'media';
    text: string;
}

export interface IPublishMediaGroupMessage {
    kind: 'mediaGroup';
    text: string;
    media: IMedia[];
}

export interface IPublishAdvertisementMessage {
    kind: 'advertisement';
    text: string;

    /**
     * Document url stored in Azure Blob Storage
     */
    media: string;

    button: {
        text: string;
        url: string;
    }
}

export interface IMedia {
    url: string;
    type: 'photo' | 'video';
}

export interface IAttachment {
    type: 'photo' | 'video';
    mimeType: string;
    filename: string;
    filepath: string;
    caption?: string;
}

export type PublishOptions =
    IPublishTextMessage
    | IPublishMediaMessage
    | IPublishMediaGroupMessage
    | IPublishAdvertisementMessage;
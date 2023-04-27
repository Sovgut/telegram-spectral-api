import {PublishAdvertisementPhotoService} from "~services/publish/advertisement/photo-service.js";
import {PublishAdvertisementVideoService} from "~services/publish/advertisement/video-service.js";
import {IButton, IDocument} from "~types/entities.js";

export class PublishAdvertisementProvider {
    private advertisementPhotoService: PublishAdvertisementPhotoService;
    private advertisementVideoService: PublishAdvertisementVideoService;

    constructor() {
        this.advertisementPhotoService = new PublishAdvertisementPhotoService();
        this.advertisementVideoService = new PublishAdvertisementVideoService();
    }

    public async send(chatId: string, text: string, document: IDocument, button: IButton) {
        if (document.type === 'photo') {
            await this.advertisementPhotoService.send(chatId, text, document, button);
        }

        if (document.type === 'video') {
            await this.advertisementVideoService.send(chatId, text, document, button);
        }
    }
}
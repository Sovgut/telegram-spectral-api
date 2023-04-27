import {AdvertisementPhotoService} from "~services/publish/advertisement/photo-service.js";
import {AdvertisementVideoService} from "~services/publish/advertisement/video-service.js";
import {IButton, IDocument} from "~types/entities.js";

export class AdvertisementProvider {
    private advertisementPhotoService: AdvertisementPhotoService;
    private advertisementVideoService: AdvertisementVideoService;

    constructor() {
        this.advertisementPhotoService = new AdvertisementPhotoService();
        this.advertisementVideoService = new AdvertisementVideoService();
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
import {_isPhoto} from "~core/utils/is-photo.js";

export function _getDocumentType(mimeType: string) {
    if (_isPhoto(mimeType)) {
        return 'photo'
    }

    return 'video'
}
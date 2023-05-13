import {_Logger} from './logger.js'
import {_Environment} from './config.js'
import {_extractFilename} from "~core/utils/extract-filename.js";
import {_optimizePhoto} from "~core/utils/optimize-photo.js";
import {_optimizeVideo} from "~core/utils/optimize-video.js";
import {_partial} from "~core/utils/partial.js";
import {_rootPath} from "~core/utils/root-path.js";
import {_isVideo} from "~core/utils/is-video.js";
import {_isPhoto} from "~core/utils/is-photo.js";
import {_getDocumentType} from "~core/utils/document-type.js";

import * as _Constants from './constants.js'

export namespace Core {
    export const Logger = _Logger;
    export const Environment = _Environment;
    export const Constants = _Constants;

    export namespace Utils {
        export const extractFilename = _extractFilename;
        export const optimizePhoto = _optimizePhoto;
        export const optimizeVideo = _optimizeVideo;
        export const partial = _partial;
        export const rootPath = _rootPath;
        export const isVideo = _isVideo;
        export const isPhoto = _isPhoto;
        export const getDocumentType = _getDocumentType;
    }
}
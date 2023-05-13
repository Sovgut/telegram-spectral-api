import {imageSize} from "image-size";
import {Core} from "~core/namespace.js";

export async function getDimensions(inputFilename: string) {
    Core.Logger.log('Processing', `Getting dimensions from image ${inputFilename}`);

    const maxDimension = 320;
    const originalDimensions = imageSize(Core.Utils.rootPath(`temp/${inputFilename}`)) as {
        width: number,
        height: number
    };

    let thumbnailWidth: number;
    let thumbnailHeight: number;

    if (originalDimensions.width > originalDimensions.height) {
        thumbnailWidth = maxDimension;
        thumbnailHeight = Math.round(
            (originalDimensions.height / originalDimensions.width) * maxDimension
        );
    } else {
        thumbnailHeight = maxDimension;
        thumbnailWidth = Math.round(
            (originalDimensions.width / originalDimensions.height) * maxDimension
        );
    }

    return {width: thumbnailWidth, height: thumbnailHeight};
}
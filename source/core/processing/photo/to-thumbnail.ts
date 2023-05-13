import sharp from "sharp";
import {Core} from "~core/namespace.js";
import {JpegExtension, PngExtension} from "~core/telegram/constants.js";

export async function toThumbnail(inputFilename: string, dimensions: { width: number, height: number }) {
    Core.Logger.log('Processing', `Creating thumbnail from image ${inputFilename}`);

    const outputFilename = inputFilename.replace(PngExtension, JpegExtension);

    await sharp(Core.Utils.rootPath(`temp/${inputFilename}`))
        .jpeg({quality: 50})
        .resize({width: dimensions.width, height: dimensions.height, withoutEnlargement: true})
        .toFile(Core.Utils.rootPath(`temp/${outputFilename}`))

    return outputFilename;
}
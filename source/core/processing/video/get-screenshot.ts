import ffmpeg from "fluent-ffmpeg";
import {Core} from "~core/namespace.js";
import {PlainExtension, VideoExtension} from "~core/telegram/constants.js";

export async function getScreenshot(inputFilename: string): Promise<string> {
    const outputFilename = inputFilename.replace(VideoExtension, PlainExtension);

    Core.Logger.log('Processing', `Creating screenshot from video ${inputFilename}`);
    return await new Promise((resolve, reject) => {
        ffmpeg(Core.Utils.rootPath(`temp/${inputFilename}`))
            .on('end', () => resolve(`${outputFilename}.png`))
            .on('error', error => reject(error))
            .screenshots({
                timestamps: ['00:00:00.000'],
                filename: outputFilename,
                folder: Core.Utils.rootPath('temp/'),
            });
    });
}
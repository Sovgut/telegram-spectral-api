import ffmpeg from "fluent-ffmpeg";
import {Core} from "~core/namespace.js";

export async function getDuration(inputFilename: string): Promise<number> {
    Core.Logger.log('Processing', `Getting duration from video ${inputFilename}`);

    return await new Promise<number>((resolve, reject) => {
        ffmpeg.ffprobe(Core.Utils.rootPath(`temp/${inputFilename}`), (error, metadata) => {
            if (error) reject(error);
            else resolve(metadata.format.duration as number);
        });
    });
}
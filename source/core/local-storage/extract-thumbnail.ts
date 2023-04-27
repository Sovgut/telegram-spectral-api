import ffmpeg from 'fluent-ffmpeg'
import sharp from 'sharp';
import {imageSize} from 'image-size';
import {Environment} from '~core/config.js';
import {rootPath} from '~core/utils/root-path.js';
import {LocalStorageProvider} from "~core/local-storage/provider.js";

interface IThumbnail {
    filename: string,
    width: number | undefined,
    height: number | undefined
}

export async function extractThumbnail(videoPath: string, imagePath: string): Promise<IThumbnail> {
    const localStorage = new LocalStorageProvider();

    if (!Environment.isDevelopment) {
        ffmpeg.setFfmpegPath(Environment.ffmpegPath)
        ffmpeg.setFfprobePath(Environment.ffprobePath)
    }

    const filename = await new Promise((resolve, reject) => {
        ffmpeg(rootPath(`temp/${videoPath}`))
            .on('end', () => resolve(`${imagePath}`))
            .on('error', error => reject(error))
            .screenshots({
                timestamps: ['00:00:00.000'],
                filename: imagePath,
                folder: rootPath('temp/'),
            });
    }) as string;

    await sharp(rootPath(`temp/${filename}.png`))
        .jpeg({quality: 50})
        .toFile(rootPath(`temp/${filename}.jpg`))

    await localStorage.delete(`${filename}.png`);

    const dimensions = imageSize(rootPath(`temp/${filename}.jpg`));

    return {filename: `${filename}.jpg`, width: dimensions.width, height: dimensions.height}
}
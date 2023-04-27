import ffmpeg from 'fluent-ffmpeg'
import sharp from 'sharp';
import { imageSize } from 'image-size';
import { Environment } from '../config.js';
import { rootPath } from '../utils/root-path.js';
import { RemoteFileStream } from '../files.js';

interface IThumbnail {
  filename: string,
  width: number | undefined,
  height: number | undefined
}

export async function extractThumbnail(videoPath: string, imagePath: string): Promise<IThumbnail> {
  if (!Environment.isDevelopment) {
    ffmpeg.setFfmpegPath(Environment.ffmpegPath)
    ffmpeg.setFfprobePath(Environment.ffprobePath)
  }

  const filename = await new Promise((resolve, reject) => {
    ffmpeg(rootPath(`../shared/${videoPath}`))
      .on('end', () => resolve(`${imagePath}`))
      .on('error', error => reject(error))
      .screenshots({
        timestamps: ['00:00:00.000'],
        filename: imagePath,
        folder: rootPath('../shared'),
      });
  }) as string;

  await sharp(rootPath(`../shared/${filename}.png`))
    .jpeg({ quality: 50 })
    .toFile(rootPath(`../shared/${filename}.jpg`))

  await RemoteFileStream.deleteFile(`${filename}.png`)

  const dimensions = imageSize(rootPath(`../shared/${filename}.jpg`));

  return { filename: `${filename}.jpg`, width: dimensions.width, height: dimensions.height }
}
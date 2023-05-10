import ffmpeg from "fluent-ffmpeg";
import fs from "node:fs";
import {Environment} from "~core/config.js";

export async function optimizeVideo(inputPath: string, outputPath: string): Promise<string> {
    if (!Environment.isDevelopment) {
        ffmpeg.setFfmpegPath(Environment.ffmpegPath)
        ffmpeg.setFfprobePath(Environment.ffprobePath)
    }

    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .output(outputPath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .outputOptions(['-preset slow', '-crf 23', '-b:a 128k'])
            .on('end', async () => {
                await fs.promises.unlink(inputPath)
                resolve(outputPath)
            })
            .on('error', reject)
            .run()
    })
}
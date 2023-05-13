import ffmpeg from "fluent-ffmpeg";
import fs from "node:fs";
import {Core} from "~core/namespace.js";

export async function _optimizeVideo(inputPath: string, outputPath: string): Promise<string> {
    if (!Core.Environment.isDevelopment) {
        ffmpeg.setFfmpegPath(Core.Environment.ffmpegPath)
        ffmpeg.setFfprobePath(Core.Environment.ffprobePath)
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
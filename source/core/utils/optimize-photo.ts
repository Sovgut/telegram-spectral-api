import sharp from "sharp";
import fs from "node:fs";

export async function optimizePhoto(inputPath: string, outputPath: string) {
    await sharp(inputPath)
        .jpeg({quality: 75})
        .toFile(outputPath)
    await fs.promises.unlink(inputPath)

    return outputPath
}
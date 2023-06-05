import { PlainExtension, VideoExtension } from "~core/telegram/constants.js";
import { Core } from "~core/namespace.js";
import ffmpeg from "fluent-ffmpeg";
import fs from "node:fs";
import { Decorators } from "~core/decorators.js";

export class VideoProcessing {
	/**
	 * Optimizes video and returns filename of optimized video file in temp folder
	 *
	 * @param inputPath
	 * @param outputPath
	 * @returns Filename of optimized video file in temp folder
	 */
	@Decorators.Logger("Optimizing video")
	public async optimize(inputPath: string, outputPath: string): Promise<string | never> {
		return new Promise((resolve, reject) => {
			ffmpeg(inputPath)
				.output(outputPath)
				.videoCodec("libx264")
				.audioCodec("aac")
				.outputOptions(["-preset slow", "-crf 23", "-b:a 128k"])
				.on("end", async () => {
					await fs.promises.unlink(inputPath);
					resolve(outputPath);
				})
				.on("error", reject)
				.run();
		});
	}

	/**
	 * Creates screenshot from video file and returns filename of screenshot
	 *
	 * @param inputFilename
	 * @returns Filename of screenshot
	 */
	@Decorators.Logger("Creating screenshot from video")
	public async getScreenshot(inputFilename: string): Promise<string | never> {
		const outputFilename = inputFilename.replace(VideoExtension, PlainExtension);

		return await new Promise((resolve, reject) => {
			ffmpeg(Core.Utils.rootPath(`temp/${inputFilename}`))
				.on("end", () => resolve(`${outputFilename}.png`))
				.on("error", (error) => reject(error))
				.screenshots({
					timestamps: ["00:00:00.000"],
					filename: outputFilename,
					folder: Core.Utils.rootPath("temp/"),
				});
		});
	}

	/**
	 * Get duration from video file and return duration in seconds
	 *
	 * @param inputFilename
	 * @returns Duration in seconds
	 */
	@Decorators.Logger("Getting duration from video")
	public async getDuration(inputFilename: string): Promise<number | never> {
		return await new Promise<number>((resolve, reject) => {
			ffmpeg.ffprobe(Core.Utils.rootPath(`temp/${inputFilename}`), (error: Error | undefined, metadata) => {
				if (typeof error !== "undefined") {
					reject(error);
				} else {
					resolve(metadata.format.duration as number);
				}
			});
		});
	}
}

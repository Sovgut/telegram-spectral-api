import { imageSize } from "image-size";
import { Core } from "~core/namespace.js";
import { JpegExtension, PngExtension } from "~core/telegram/constants.js";
import sharp from "sharp";
import { Dimensions } from "~types/common/processing.js";
import { LocalStorage } from "~core/local-storage/provider.js";
import { VideoProcessing } from "~core/processing/video.js";
import { StoragePathType } from "~types/blob-storage.js";
import fs from "node:fs";
import { Decorators } from "~core/decorators.js";

export class PhotoProcessing {
	/**
	 * Optimizes photo and returns filename of optimized photo file in temp folder
	 *
	 * @param inputPath
	 * @param outputPath
	 * @returns Filename of optimized photo file in temp folder
	 */
	@Decorators.Logger("Optimizing photo")
	public async optimize(inputPath: string, outputPath: string): Promise<string> {
		await sharp(inputPath).jpeg({ quality: 75 }).toFile(outputPath);
		await fs.promises.unlink(inputPath);

		return outputPath;
	}

	/**
	 * Get dimensions from image file and return thumbnail dimensions
	 *
	 * @param inputFilename
	 * @returns Thumbnail dimensions
	 */
	@Decorators.Logger("Creating dimensions for thumbnail")
	public async createDimensions(inputFilename: string): Promise<Dimensions> {
		const maxDimension = 320;
		const originalDimensions = imageSize(Core.Utils.rootPath(`temp/${inputFilename}`)) as Dimensions;

		let thumbnailWidth: number;
		let thumbnailHeight: number;

		if (originalDimensions.width > originalDimensions.height) {
			thumbnailWidth = maxDimension;
			thumbnailHeight = Math.round((originalDimensions.height / originalDimensions.width) * maxDimension);
		} else {
			thumbnailHeight = maxDimension;
			thumbnailWidth = Math.round((originalDimensions.width / originalDimensions.height) * maxDimension);
		}

		return { width: thumbnailWidth, height: thumbnailHeight };
	}

	/**
	 * Creates thumbnail from image file and returns filename of thumbnail
	 *
	 * @param inputFilename
	 * @param dimensions
	 * @returns Filename of thumbnail
	 */
	@Decorators.Logger("Creating thumbnail from image")
	public async createThumbnail(inputFilename: string, dimensions: Dimensions): Promise<string> {
		const outputFilename = inputFilename.replace(PngExtension, JpegExtension);

		await sharp(Core.Utils.rootPath(`temp/${inputFilename}`))
			.jpeg({ quality: 50 })
			.resize({ width: dimensions.width, height: dimensions.height, withoutEnlargement: true })
			.toFile(Core.Utils.rootPath(`temp/${outputFilename}`));

		return outputFilename;
	}

	/**
	 * Creates thumbnail from image file and returns filename of thumbnail with dimensions
	 *
	 * @param inputFilename
	 * @returns Filename of thumbnail with dimensions
	 */
	public async getThumbnail(inputFilename: string): Promise<Dimensions & { filename: string }> {
		const videoProcessing = new VideoProcessing();
		const localStorage = new LocalStorage();

		const screenshot = await videoProcessing.getScreenshot(inputFilename);
		const dimensions = await this.createDimensions(screenshot);
		const thumbnail = await this.createThumbnail(screenshot, dimensions);

		await localStorage.destroy(screenshot, StoragePathType.FileName);

		return { filename: thumbnail, ...dimensions };
	}
}

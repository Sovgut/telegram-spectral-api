import { type FastifyRequest } from "fastify";
import busboy from "busboy";
import fs, { type ReadStream } from "node:fs";
import { nanoid } from "nanoid";
import mime2ext from "mime2ext";
import { VideoSize } from "~core/constants.js";
import { BadRequestError } from "~core/errors/bad-request.js";
import { Core } from "~core/namespace.js";
import { StoragePathType } from "~types/blob-storage.js";
import { LocalStorageResponse } from "~core/local-storage/classes.js";
import { PhotoProcessing } from "~core/processing/photo.js";
import { VideoProcessing } from "~core/processing/video.js";
import { Decorators } from "~core/decorators.js";

export class LocalStorage {
	/**
	 * Gets filename from provided in argument
	 *
	 * @param value Filename to get from
	 * @param pathType Path type to get filename from
	 * @returns Filename string
	 */
	@Decorators.Logger("Getting filename from value string")
	private getFilename(value: string, pathType: StoragePathType): string {
		if (pathType === StoragePathType.FileName) return value;

		return Core.Utils.extractFilename(value);
	}

	/**
	 * Writes file to local storage using busboy
	 * @param request Fastify request object
	 *
	 * @returns Promise with filename, mimeType and extension
	 */
	@Decorators.Logger("Writing file to local storage")
	public async write(request: FastifyRequest): Promise<LocalStorageResponse> {
		const stream = busboy({ headers: request.headers, limits: { fileSize: VideoSize } });
		const photoProcessing = new PhotoProcessing();
		const videoProcessing = new VideoProcessing();

		return new Promise((resolve, reject) => {
			let filename = String();
			let mimeType = String();
			let extension = String();

			stream.on("file", (_, file, info) => {
				mimeType = info.mimeType;
				extension = mime2ext(mimeType);
				filename = `${nanoid()}-${Date.now()}`;

				const fileStream = fs.createWriteStream(Core.Utils.rootPath(`temp/${filename}.${extension}`));

				file.pipe(fileStream);
			});

			stream.on("close", async () => {
				const stat = await fs.promises.stat(Core.Utils.rootPath(`temp/${filename}.${extension}`));

				if (stat.size === 0) {
					await this.destroy(`${filename}.${extension}`);

					return reject(new BadRequestError("File is empty", "file_empty"));
				}

				if (mimeType.startsWith("video") && stat.size >= VideoSize) {
					await this.destroy(`${filename}.${extension}`);

					return reject(new BadRequestError("File is too large", "file_is_too_large"));
				}

				if (mimeType.startsWith("image") && mimeType !== "image/gif") {
					const inputFile = Core.Utils.rootPath(`temp/${filename}.${extension}`);
					const outputFile = Core.Utils.rootPath(`temp/${filename}-optimized.jpg`);

					await photoProcessing.optimize(inputFile, outputFile);

					filename = `${filename}-optimized`;
					extension = "jpg";
					mimeType = "image/jpeg";
				}

				if (mimeType.startsWith("video")) {
					const inputFile = Core.Utils.rootPath(`temp/${filename}.${extension}`);
					const outputFile = Core.Utils.rootPath(`temp/${filename}-optimized.mp4`);

					await videoProcessing.optimize(inputFile, outputFile);

					filename = `${filename}-optimized`;
					extension = "mp4";
					mimeType = "video/mp4";
				}

				resolve(new LocalStorageResponse(filename, mimeType, extension));
			});
			stream.on("error", (error) => {
				reject(error);
			});

			request.raw.pipe(stream);
		});
	}

	/**
	 * Reads file from local storage and returns stream
	 *
	 * @param filename Filename to read
	 * @param pathType Path type to get filename from
	 * @returns Readable stream
	 */
	@Decorators.Logger("Reading file from local storage")
	public async read(filename: string, pathType: StoragePathType = StoragePathType.Url): Promise<ReadStream> {
		const preparedFilename = this.getFilename(filename, pathType);
		const path = Core.Utils.rootPath(`temp/${preparedFilename}`);

		return Promise.resolve(fs.createReadStream(path));
	}

	/**
	 * Deletes file from local storage
	 * @param filename Filename to delete
	 * @param pathType Path type to get filename from
	 */
	@Decorators.Logger("Deleting file from local storage")
	public async destroy(filename: string, pathType: StoragePathType = StoragePathType.Url): Promise<void> {
		const preparedFilename = this.getFilename(filename, pathType);

		await fs.promises.unlink(Core.Utils.rootPath(`temp/${preparedFilename}`));
	}

	/**
	 * Gets file size from local storage in bytes
	 *
	 * @param filename
	 * @param pathType
	 * @returns File size in bytes
	 */
	@Decorators.Logger("Getting file size from local storage")
	public async getSize(filename: string, pathType: StoragePathType = StoragePathType.FilePath): Promise<number | never> {
		const preparedFilename = this.getFilename(filename, pathType);
		const stats = await fs.promises.stat(Core.Utils.rootPath(`temp/${preparedFilename}`));

		return stats.size;
	}
}

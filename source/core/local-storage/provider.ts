import {FastifyRequest} from "fastify";
import busboy from "busboy";
import fs from "node:fs";
import {nanoid} from "nanoid";
import mime2ext from "mime2ext";
import {VideoSize} from "~core/constants.js";
import {BadRequestError} from "~core/errors/bad-request.js";
import {Core} from "~core/namespace.js";

/**
 * Storage enum types for correctly getting filename from input value
 */
enum StoragePathType {
    Url,
    FilePath,
    FileName,
}

export class LocalStorage {
    protected static logger = new Core.Logger('LocalStorage');
    public static StoragePathType = StoragePathType;

    /**
     * Gets filename from provided in argument
     *
     * @param value Filename to get from
     * @param pathType Path type to get filename from
     *
     * @returns Filename string
     */
    protected static getFilename(value: string, pathType: StoragePathType) {
        if (pathType === this.StoragePathType.FileName) return value;

        return Core.Utils.extractFilename(value);
    }

    /**
     * Writes file to local storage using busboy
     * @param request Fastify request object
     *
     * @returns Promise with filename, mimeType and extension
     */
    public static async write(request: FastifyRequest): Promise<{
        filename: string,
        mimeType: string,
        extension: string
    }> {
        const stream = busboy({headers: request.headers, limits: {fileSize: VideoSize}})

        return new Promise((resolve, reject) => {
            let filename = String()
            let mimeType = String()
            let extension = String()

            stream.on('file', (_, file, info) => {
                mimeType = info.mimeType;
                extension = mime2ext(mimeType);
                filename = `${nanoid()}-${Date.now()}`;

                const fileStream = fs.createWriteStream(Core.Utils.rootPath(`temp/${filename}.${extension}`));

                file.pipe(fileStream);
            });

            stream.on('close', async () => {
                const stat = await fs.promises.stat(Core.Utils.rootPath(`temp/${filename}.${extension}`))

                this.logger.log(`Stored file ${filename}.${extension} with size ${stat.size} bytes and mime type ${mimeType}`)

                if (stat.size === 0) {
                    await this.delete(`${filename}.${extension}`);

                    return reject(new BadRequestError('File is empty', 'file_empty'));
                }

                if (mimeType.startsWith('video') && stat.size >= VideoSize) {
                    await this.delete(`${filename}.${extension}`);

                    return reject(new BadRequestError('File is too large', 'file_is_too_large'))
                }

                if (mimeType.startsWith('image') && mimeType !== 'image/gif') {
                    await Core.Utils.optimizePhoto(Core.Utils.rootPath(`temp/${filename}.${extension}`), Core.Utils.rootPath(`temp/${filename}-optimized.jpg`))

                    filename = `${filename}-optimized`
                    extension = 'jpg'
                    mimeType = 'image/jpeg'
                }

                if (mimeType.startsWith('video')) {
                    await Core.Utils.optimizeVideo(Core.Utils.rootPath(`temp/${filename}.${extension}`), Core.Utils.rootPath(`temp/${filename}-optimized.mp4`))

                    filename = `${filename}-optimized`
                    extension = 'mp4'
                    mimeType = 'video/mp4'
                }

                resolve({filename, mimeType, extension})
            })
            stream.on('error', (error) => reject(error))

            request.raw.pipe(stream)
        })
    }

    /**
     * Reads file from local storage and returns stream
     * @param filename Filename to read
     * @param pathType Path type to get filename from
     *
     * @returns Readable stream
     */
    public static read(filename: string, pathType: StoragePathType = StoragePathType.Url) {
        const preparedFilename = this.getFilename(filename, pathType);

        this.logger.log(`Reading file ${preparedFilename}`)

        return fs.createReadStream(Core.Utils.rootPath(`temp/${preparedFilename}`));
    }

    /**
     * Deletes file from local storage
     * @param filename Filename to delete
     * @param pathType Path type to get filename from
     */
    public static async delete(filename: string, pathType: StoragePathType = StoragePathType.Url) {
        const preparedFilename = this.getFilename(filename, pathType);

        this.logger.log(`Deleting file ${preparedFilename}`)

        return await fs.promises.unlink(Core.Utils.rootPath(`temp/${preparedFilename}`));
    }
}
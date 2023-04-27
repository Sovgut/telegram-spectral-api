import {FastifyRequest} from "fastify";
import busboy from "busboy";
import fs from "node:fs";
import {rootPath} from "~core/utils/root-path.js";
import {nanoid} from "nanoid";
import mime2ext from "mime2ext";

export class LocalStorageProvider {
    /**
     * Returns filename from value argument
     * @param value Value to extract filename from
     *
     * @returns Filename string
     */
    protected getFilename(value: string) {
        return value;
    }

    /**
     * Writes file to local storage using busboy
     * @param request Fastify request object
     *
     * @returns Promise with filename, mimeType and extension
     */
    public async write(request: FastifyRequest) {
        const stream = busboy({headers: request.headers})

        return new Promise((resolve, reject) => {
            let filename = String()
            let mimeType = String()
            let extension = String()

            stream.on('file', (_, file, info) => {
                mimeType = info.mimeType;
                extension = mime2ext(mimeType);
                filename = `${nanoid()}-${Date.now()}`;

                const fileStream = fs.createWriteStream(rootPath(`temp/${filename}.${extension}`));

                file.pipe(fileStream);
            });

            stream.on('close', () => resolve({filename, mimeType, extension}))
            stream.on('error', (error) => reject(error))

            request.raw.pipe(stream)
        })
    }

    /**
     * Reads file from local storage and returns stream
     * @param filename Filename to read
     *
     * @returns Readable stream
     */
    public read(filename: string) {
        const preparedFilename = this.getFilename(filename);

        return fs.createReadStream(rootPath(`temp/${preparedFilename}`));
    }

    /**
     * Deletes file from local storage
     * @param filename Filename to delete
     */
    public async delete(filename: string) {
        const preparedFilename = this.getFilename(filename);

        return await fs.promises.unlink(rootPath(`temp/${preparedFilename}`));
    }
}
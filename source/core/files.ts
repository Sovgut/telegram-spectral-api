import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import { rootPath } from './utils/root-path.js';
import { extractFilename } from './utils/extract-filename.js';
import busboy from 'busboy';
import { FastifyRequest } from 'fastify';

export class RemoteFileStream {
    public static async saveFile(request: FastifyRequest): Promise<{ filename: string, mimeType: string }> {
        const bb = busboy({ headers: request.headers });

        return new Promise((resolve, reject) => {
            let savedFilename = '';
            let savedMimeType = '';

            bb.on('file', function (_fieldname, file, info) {
                const { mimeType, filename } = info;

                savedMimeType = mimeType;
                savedFilename = filename;

                const fileStream = fs.createWriteStream(rootPath(`../shared/${filename}`));

                file.pipe(fileStream);
            });

            bb.on('finish', function () {
                resolve({ filename: savedFilename, mimeType: savedMimeType });
            });

            bb.on('error', error => reject(error));

            request.raw.pipe(bb);
        });
    }

    public static getFileStreamFromUrl(url: string) {
        const filename = extractFilename(url);

        return fs.createReadStream(rootPath(`../shared/${filename}`))
    }

    public static getFileStream(filename: string) {
        return fs.createReadStream(rootPath(`../shared/${filename}`))
    }

    public static async deleteFileFromUrl(url: string) {
        const filename = extractFilename(url);

        if (!fs.existsSync(rootPath(`../shared/${filename}`))) return;

        await fsPromises.unlink(rootPath(`../shared/${filename}`))
    }

    public static async deleteFile(filename: string) {
        await fsPromises.unlink(rootPath(`../shared/${filename}`))
    }
}
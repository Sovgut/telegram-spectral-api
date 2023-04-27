import internal from "node:stream";
import mime2ext from "mime2ext";
import { nanoid } from "nanoid";
import { BlobServiceClient } from "@azure/storage-blob";
import { rootPath } from "~core/utils/root-path.js";
import { Environment } from "~core/config.js";
import { IWriteOptions } from "~types/blob-storage.js";

export class AzureBlobStorageProvider {
    protected client: BlobServiceClient;

    constructor() {
        this.client = BlobServiceClient.fromConnectionString(
            Environment.azureStorageConnectionString
        );
    }

    /**
     * Checks if container exists in Azure Storage
     * 
     * @param containerName Container name to check for existence in Azure Storage
     * 
     * @returns True if container exists, false otherwise
     */
    protected async isContainerExists(containerName: string) {
        const container = this.client.getContainerClient(containerName);

        return await container.exists();
    }

    /**
     * Creates container in Azure Storage
     * 
     * @param containerName Container name to create in Azure Storage
     * 
     * @returns Container creation response
     */
    protected async createContainer(containerName: string) {
        const container = this.client.getContainerClient(containerName);

        return await container.create();
    }

    /**
     * Create filename from options or generates new one
     * 
     * @param defaultName Default filename to use if options.fileName is provided
     * @param mimeType Mime type of file to extracts extension string
     * 
     * @returns Filename string with extension
     */
    protected createFilename(defaultName?: string, mimeType?: string) {
        if (defaultName) return defaultName;
        if (!mimeType) {
            return `${nanoid()}-${Date.now()}`;
        }

        const extension = mime2ext(mimeType);
        return `${nanoid()}-${Date.now()}.${extension}`;
    }

    /**
     * Gets filename from provided in argument
     * 
     * @param value Filename to get from
     * 
     * @returns Filename string
     */
    protected getFilename(value: string) {
        return value;
    }

    /**
     * Gets headers for Azure Storage blob
     * 
     * @param mimeType Mime type of file to set in blob headers
     * 
     * @returns Blob headers object
     */
    protected getHeaders(mimeType?: string) {
        return { blobHTTPHeaders: { blobContentType: mimeType } }
    }

    /**
     * Creates response object for file upload
     * 
     * @param mimeType Mime type of file to set in response
     * @param filename Filename to set in response
     * 
     * @returns Response object with url, mimeType and filename
     */
    protected createResponse(filename: string, mimeType?: string) {
        const account = Environment.azureStorageAccountName;
        const container = Environment.azureStorageContainerName;

        return {
            url: `https://${account}.blob.core.windows.net/${container}/${filename}`,
            mimeType,
            filename
        };
    }

    /**
     * Uploads file to Azure Storage
     * 
     * @param stream Readable stream to upload to Azure Storage
     * @param options Options object to set filename and mimeType
     * 
     * @returns Response object with url, mimeType and filename
     */
    public async write(stream: internal.Readable, options: IWriteOptions = {}) {
        if (!await this.isContainerExists(Environment.azureStorageContainerName)) {
            await this.createContainer(Environment.azureStorageContainerName);
        }

        const filename = this.createFilename(options.fileName, options.mimeType);
        const headers = this.getHeaders(options.mimeType);
        const container = this.client.getContainerClient(Environment.azureStorageContainerName);
        const blockBlobClient = container.getBlockBlobClient(filename);

        await blockBlobClient.uploadStream(stream, undefined, undefined, headers);

        return this.createResponse(filename, options.mimeType);
    }

    /**
     * Downloads file from Azure Storage
     * 
     * @param fileName Filename to download from Azure Storage
     * 
     * @returns Path to downloaded file
     */
    public async read(fileName: string) {
        const preparedFilename = this.getFilename(fileName);
        const path = rootPath(`temp/${preparedFilename}`);
        const container = this.client.getContainerClient(Environment.azureStorageContainerName);
        const blockBlobClient = container.getBlockBlobClient(preparedFilename);

        await blockBlobClient.downloadToFile(path)

        return path;
    }

    /**
     * Deletes file from Azure Storage
     * 
     * @param fileName Filename to delete from Azure Storage
     */
    public async delete(fileName: string) {
        const preparedFilename = this.getFilename(fileName);
        const container = this.client.getContainerClient(Environment.azureStorageContainerName);
        const blockBlobClient = container.getBlockBlobClient(preparedFilename);

        await blockBlobClient.delete()
    }
}

import internal from "node:stream";
import mime2ext from "mime2ext";
import {nanoid} from "nanoid";
import {BlobServiceClient} from "@azure/storage-blob";
import {IWriteOptions} from "~types/blob-storage.js";
import {Core} from "~core/namespace.js";

/**
 * Storage enum types for correctly getting filename from input value
 */
enum StoragePathType {
    Url,
    FilePath,
    FileName,
}

export class AzureStorage {
    protected static logger = new Core.Logger('AzureStorage');
    protected static client = BlobServiceClient.fromConnectionString(
        Core.Environment.azureStorageConnectionString
    );
    public static StoragePathType = StoragePathType;

    /**
     * Checks if container exists in Azure Storage
     *
     * @param containerName Container name to check for existence in Azure Storage
     *
     * @returns True if container exists, false otherwise
     */
    protected static async isContainerExists(containerName: string) {
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
    protected static async createContainer(containerName: string) {
        const container = this.client.getContainerClient(containerName);

        this.logger.log(`Creating container ${containerName}`);

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
    protected static createFilename(defaultName?: string, mimeType?: string) {
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
     * @param pathType Path type to get filename from
     *
     * @returns Filename string
     */
    protected static getFilename(value: string, pathType: StoragePathType) {
        if (pathType === this.StoragePathType.FileName) return value;

        return Core.Utils.extractFilename(value);
    }

    /**
     * Gets headers for Azure Storage blob
     *
     * @param mimeType Mime type of file to set in blob headers
     *
     * @returns Blob headers object
     */
    protected static getHeaders(mimeType?: string) {
        return {blobHTTPHeaders: {blobContentType: mimeType}}
    }

    /**
     * Creates response object for file upload
     *
     * @param mimeType Mime type of file to set in response
     * @param filename Filename to set in response
     *
     * @returns Response object with url, mimeType and filename
     */
    protected static createResponse(filename: string, mimeType?: string) {
        const account = Core.Environment.azureStorageAccountName;
        const container = Core.Environment.azureStorageContainerName;

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
    public static async write(stream: internal.Readable, options: IWriteOptions = {}) {
        if (!await this.isContainerExists(Core.Environment.azureStorageContainerName)) {
            await this.createContainer(Core.Environment.azureStorageContainerName);
        }

        this.logger.log(`Storing file ${options.fileName}`);

        const filename = this.createFilename(options.fileName, options.mimeType);
        const headers = this.getHeaders(options.mimeType);
        const container = this.client.getContainerClient(Core.Environment.azureStorageContainerName);
        const blockBlobClient = container.getBlockBlobClient(filename);

        await blockBlobClient.uploadStream(stream, undefined, undefined, headers);

        return this.createResponse(filename, options.mimeType);
    }

    /**
     * Downloads file from Azure Storage
     *
     * @param fileName Filename to download from Azure Storage
     * @param pathType Path type to get filename from fileName value
     *
     * @returns Path to downloaded file
     */
    public static async read(fileName: string, pathType: StoragePathType = StoragePathType.Url) {
        const preparedFilename = this.getFilename(fileName, pathType);
        const path = Core.Utils.rootPath(`temp/${preparedFilename}`);
        const container = this.client.getContainerClient(Core.Environment.azureStorageContainerName);
        const blockBlobClient = container.getBlockBlobClient(preparedFilename);

        await blockBlobClient.downloadToFile(path)

        this.logger.log(`Downloaded file ${preparedFilename}`);

        return path;
    }

    /**
     * Deletes file from Azure Storage
     *
     * @param fileName Filename to delete from Azure Storage
     * @param pathType Path type to get filename from fileName value
     */
    public static async delete(fileName: string, pathType: StoragePathType = StoragePathType.Url) {
        const preparedFilename = this.getFilename(fileName, pathType);
        const container = this.client.getContainerClient(Core.Environment.azureStorageContainerName);
        const blockBlobClient = container.getBlockBlobClient(preparedFilename);

        this.logger.log(`Deleting file ${preparedFilename}`);

        await blockBlobClient.delete()
    }
}

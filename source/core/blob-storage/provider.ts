import internal from "node:stream";
import mime2ext from "mime2ext";
import { nanoid } from "nanoid";
import { type BlobDeleteResponse, BlobServiceClient, type BlockBlobUploadStreamOptions, type ContainerCreateResponse } from "@azure/storage-blob";
import { type IWriteOptions, StoragePathType } from "~types/blob-storage.js";
import { AzureStorageResponse } from "~core/blob-storage/classes.js";
import { Config } from "~core/config/class.js";
import { Core } from "~core/namespace.js";
import { Decorators } from "~core/decorators.js";

export class AzureStorage {
  private readonly client = BlobServiceClient.fromConnectionString(Config.azureStorageConnectionString());

  /**
   * Checks if container exists in Azure Storage
   *
   * @param containerName Container name to check for existence in Azure Storage
   * @returns True if container exists, false otherwise
   */
  @Decorators.Logger("Checking if container exists in Azure Storage")
  private async isContainerExists(containerName: string): Promise<boolean> {
    const container = this.client.getContainerClient(containerName);

    return await container.exists();
  }

  /**
   * Creates container in Azure Storage
   *
   * @param containerName Container name to create in Azure Storage
   * @returns Container creation response
   */
  @Decorators.Logger("Creating container in Azure Storage")
  private async createContainer(containerName: string): Promise<ContainerCreateResponse> {
    const container = this.client.getContainerClient(containerName);

    return await container.create();
  }

  /**
   * Create filename from options or generates new one
   *
   * @param defaultName Default filename to use if options.fileName is provided
   * @param mimeType Mime type of file to extracts extension string
   * @returns Filename string with extension
   */
  @Decorators.Logger("Creating filename")
  private createFilename(defaultName?: string, mimeType?: string): string {
    if (typeof defaultName === "string" && defaultName.length > 0) return defaultName;
    if (typeof mimeType !== "string" || mimeType.length === 0) {
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
   * @returns Filename string
   */
  @Decorators.Logger("Getting filename from value string")
  private getFilename(value: string, pathType: StoragePathType): string {
    if (pathType === StoragePathType.FileName) return value;

    return Core.Utils.extractFilename(value);
  }

  /**
   * Gets headers for Azure Storage blob
   *
   * @param mimeType Mime type of file to set in blob headers
   * @returns Blob headers object
   */
  @Decorators.Logger("Getting headers for Azure Storage blob")
  private getHeaders(mimeType?: string): BlockBlobUploadStreamOptions {
    return { blobHTTPHeaders: { blobContentType: mimeType } };
  }

  /**
   * Creates response object for file upload
   *
   * @param mimeType Mime type of file to set in response
   * @param filename Filename to set in response
   * @returns Response object with url, mimeType and filename
   */
  @Decorators.Logger("Creating response object for uploaded file")
  private createResponse(filename: string, mimeType?: string): AzureStorageResponse {
    const account = Config.azureStorageAccountName();
    const container = Config.azureStorageContainerName();

    return new AzureStorageResponse(`https://${account}.blob.core.windows.net/${container}/${filename}`, filename, mimeType);
  }

  /**
   * Uploads file to Azure Storage
   *
   * @param stream Readable stream to upload to Azure Storage
   * @param options Options object to set filename and mimeType
   * @returns Response object with url, mimeType and filename
   */
  @Decorators.Logger("Uploading file to Azure Storage")
  public async write(stream: internal.Readable, options: IWriteOptions = {}): Promise<AzureStorageResponse> {
    if (!(await this.isContainerExists(Config.azureStorageContainerName()))) {
      await this.createContainer(Config.azureStorageContainerName());
    }

    const filename = this.createFilename(options.fileName, options.mimeType);
    const headers = this.getHeaders(options.mimeType);
    const container = this.client.getContainerClient(Config.azureStorageContainerName());
    const blockBlobClient = container.getBlockBlobClient(filename);

    await blockBlobClient.uploadStream(stream, undefined, undefined, headers);

    return this.createResponse(filename, options.mimeType);
  }

  /**
   * Downloads file from Azure Storage
   *
   * @param fileName Filename to download from Azure Storage
   * @param pathType Path type to get filename from fileName value
   * @returns Path to downloaded file
   */
  @Decorators.Logger("Downloading file from Azure Storage")
  public async read(fileName: string, pathType: StoragePathType = StoragePathType.Url): Promise<string> {
    const preparedFilename = this.getFilename(fileName, pathType);
    const path = Core.Utils.rootPath(`temp/${preparedFilename}`);
    const container = this.client.getContainerClient(Config.azureStorageContainerName());
    const blockBlobClient = container.getBlockBlobClient(preparedFilename);

    await blockBlobClient.downloadToFile(path);

    return path;
  }

  /**
   * Deletes file from Azure Storage
   *
   * @param fileName Filename to delete from Azure Storage
   * @param pathType Path type to get filename from fileName value
   */
  @Decorators.Logger("Deleting file from Azure Storage")
  public async destroy(fileName: string, pathType: StoragePathType = StoragePathType.Url): Promise<BlobDeleteResponse> {
    const preparedFilename = this.getFilename(fileName, pathType);
    const container = this.client.getContainerClient(Config.azureStorageContainerName());
    const blockBlobClient = container.getBlockBlobClient(preparedFilename);

    return await blockBlobClient.delete();
  }
}

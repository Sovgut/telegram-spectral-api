export interface IWriteOptions {
	mimeType?: string;
	fileName?: string;
}

/**
 * Storage enum types for correctly getting filename from input value
 */
export enum StoragePathType {
	Url,
	FilePath,
	FileName,
}

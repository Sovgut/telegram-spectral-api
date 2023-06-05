export class AzureStorageResponse {
	constructor(readonly url: string, readonly filename: string, readonly mimeType: string | undefined) {}
}

export class AzureStorageResponse {
	constructor(public readonly url: string, public readonly filename: string, public readonly mimeType: string | undefined) {}
}

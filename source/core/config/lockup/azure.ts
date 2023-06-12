import { Logger } from "~core/logger/class.js";

export class AzureConfigurationLockup {
	private readonly logger = new Logger("Config:AzureConfigurationLockup");

	public get StorageConnectionString(): string {
		const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

		if (!connectionString) {
			this.logger.error({
				scope: "StorageConnectionString",
				message: "AZURE_STORAGE_CONNECTION_STRING is required",
			});

			process.exit(1);
		}

		return connectionString;
	}

	public get StorageContainerName(): string {
		const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

		if (!containerName) {
			this.logger.error({
				scope: "StorageContainerName",
				message: "AZURE_STORAGE_CONTAINER_NAME is required",
			});

			process.exit(1);
		}

		return containerName;
	}

	public get StorageAccountName(): string {
		const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;

		if (!accountName) {
			this.logger.error({
				scope: "StorageAccountName",
				message: "AZURE_STORAGE_ACCOUNT_NAME is required",
			});

			process.exit(1);
		}

		return accountName;
	}

	public get CosmosConnectionString(): string {
		const connectionString = process.env.AZURE_COSMOS_CONNECTION_STRING;

		if (!connectionString) {
			this.logger.error({
				scope: "CosmosConnectionString",
				message: "AZURE_COSMOS_CONNECTION_STRING is required",
			});

			process.exit(1);
		}

		return connectionString;
	}

	public get CosmosDatabaseName(): string {
		const databaseName = process.env.AZURE_COSMOS_DATABASE_NAME;

		if (!databaseName) {
			this.logger.error({
				scope: "CosmosDatabaseName",
				message: "AZURE_COSMOS_DATABASE_NAME is required",
			});

			process.exit(1);
		}

		return databaseName;
	}
}

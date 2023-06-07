import { Mongoose } from "mongoose";
import { Config } from "~core/config/class.js";
import { Logger } from "~core/logger/class.js";
import { Core } from "~core/namespace.js";

const logger = new Logger("Database");
const client = new Mongoose({
	strictQuery: true,
});

await logger.log({
	scope: "databaseConnection",
	message: "Connecting to database...",
});

export const connection = await client.connect(Config.Azure.CosmosConnectionString, {
	appName: Core.Utils.getAppInfo().name,
	dbName: Config.Azure.CosmosDatabaseName,
});

process.on("SIGINT", async () => {
	await logger.log({
		scope: "databaseConnection",
		message: "SIGINT received, closing connection...",
	});

	await connection.disconnect();
});

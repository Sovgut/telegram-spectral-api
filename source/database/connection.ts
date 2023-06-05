import { Mongoose } from "mongoose";
import { Config } from "~core/config/class.js";
import { Logger } from "~core/logger.js";

const logger = new Logger();
const client = new Mongoose({
	strictQuery: true,
});

await logger.log({
	scope: "Database:databaseConnection",
	message: "Connecting to database...",
});

export const connection = await client.connect(Config.databaseConnectionString(), {
	appName: "Spectral API",
	dbName: "spectral-api-database",
});

process.on("SIGINT", async () => {
	await logger.log({
		scope: "Database:databaseConnection",
		message: "SIGINT received, closing connection...",
	});

	await connection.disconnect();
});

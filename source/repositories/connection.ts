import { type Db, MongoClient } from "mongodb";
import { Config } from "~core/config/class.js";
import { Logger } from "~core/logger.js";

const logger = new Logger();
const client = new MongoClient(Config.databaseConnectionString());

await logger.log({
	scope: "Database:databaseConnection",
	message: "Connecting to database...",
});

const connection = await client.connect();

await logger.log({
	scope: "Database:databaseConnection",
	message: "Connected to database",
});

process.on("SIGINT", async () => {
	await logger.log({
		scope: "Database:databaseConnection",
		message: "SIGINT received, closing connection...",
	});

	await client.close();
});

export async function databaseConnection(): Promise<Db> {
	return connection.db("spectral-api-database");
}

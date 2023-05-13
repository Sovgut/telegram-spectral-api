import {MongoClient} from 'mongodb'
import {Core} from "~core/namespace.js";

const client = new MongoClient(Core.Environment.databaseConnectionString);

Core.Logger.log('Database', 'Connecting...')
const connection = await client.connect();

process.on('SIGINT', async () => {
    Core.Logger.log('Database', 'Closing connection...')
    await client.close();
});

export async function databaseConnection() {
    return connection.db('spectral-api-database');
}
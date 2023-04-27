import { config } from 'dotenv';
import os from 'node:os'
import { rootPath } from './utils/root-path.js';

export class Environment {
    static {
        config({ path: rootPath('../.env') });
    }

    public static get isDevelopment() {
        return process.env.NODE_ENV === 'development';
    }

    public static get ffmpegPath() {
        if (os.platform() === 'win32') {
            return `${process.env['AZ_BATCH_APP_PACKAGE_ffmpeg#5.1.2']}\\ffmpeg.exe`
        }

        return `${process.env['AZ_BATCH_APP_PACKAGE_ffmpeg#5.1.2']}/ffmpeg`;
    }

    public static get ffprobePath() {
        if (os.platform() === 'win32') {
            return `${process.env['AZ_BATCH_APP_PACKAGE_ffprobe#5.1.2']}\\ffprobe.exe`
        }

        return `${process.env['AZ_BATCH_APP_PACKAGE_ffprobe#5.1.2']}/ffprobe`;
    }

    public static get telegramToken() {
        const token = process.env.TELEGRAM_BOT_TOKEN;

        if (!token) {
            console.error('Telegram token is required');
            process.exit(1);
        }

        return token;
    }

    public static get azureStorageConnectionString() {
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

        if (!connectionString) {
            console.error('Azure Storage connection string is required');
            process.exit(1);
        }

        return connectionString;
    }

    public static get azureStorageContainerName() {
        const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

        if (!containerName) {
            console.error('Azure Storage container name is required');
            process.exit(1);
        }

        return containerName;
    }

    public static get azureStorageAccountName() {
        const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;

        if (!accountName) {
            console.error('Azure Storage account name is required');
            process.exit(1);
        }

        return accountName;
    }

    public static get appPort() {
        const port = parseInt(String(process.env.APP_PORT), 10);

        if (isNaN(port)) {
            console.error('App port is required');
            process.exit(1);
        }

        return port;
    }
}
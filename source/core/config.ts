import os from 'node:os'
import {config} from 'dotenv';
import {_rootPath} from "~core/utils/root-path.js";

export class _Environment {
    static {
        config({path: _rootPath('.env')});
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

    public static get telegramBotToken() {
        const token = process.env.TELEGRAM_BOT_TOKEN;

        if (!token) {
            console.error('Telegram token is required');
            process.exit(1);
        }

        return token;
    }

    public static get telegramApiId() {
        const apiId = parseInt(String(process.env.TELEGRAM_API_ID), 10);

        if (isNaN(apiId)) {
            console.error('Telegram API ID is required');
            process.exit(1);
        }

        return apiId;
    }

    public static get telegramApiHash() {
        const apiHash = process.env.TELEGRAM_API_HASH;

        if (!apiHash) {
            console.error('Telegram API Hash is required');
            process.exit(1);
        }

        return apiHash;
    }

    public static get telegramPhoneNumber() {
        const phoneNumber = process.env.TELEGRAM_PHONE_NUMBER;

        if (!phoneNumber) {
            console.error('Telegram phone number is required');
            process.exit(1);
        }

        return phoneNumber;
    }

    public static get telegramPassword() {
        const password = process.env.TELEGRAM_PASSWORD;

        if (!password) {
            console.error('Telegram password is required');
            process.exit(1);
        }

        return password;
    }

    public static get telegramSessionString() {
        const sessionString = process.env.TELEGRAM_SESSION_STRING;

        if (!sessionString) {
            console.warn('Telegram session string is not found.');

            return String();
        }

        return sessionString;
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

    public static get databaseConnectionString() {
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
            console.error('DATABASE_URL connection string is required');
            process.exit(1);
        }

        return connectionString;
    }
}
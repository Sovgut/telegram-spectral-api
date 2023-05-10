import {TelegramConnectionProvider} from "~core/telegram/connection.js";

const telegramConnection = new TelegramConnectionProvider();
await telegramConnection.createSessionString();

process.exit(0);
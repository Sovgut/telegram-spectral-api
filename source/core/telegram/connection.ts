import {Logger, TelegramClient} from "telegram";
import {StringSession} from "telegram/sessions/StringSession.js";
import inquirer from "inquirer";
import {LogLevel} from "telegram/extensions/Logger.js";
import {Core} from "~core/namespace.js";

export class TelegramConnectionProvider {
    private stringSession: StringSession = new StringSession(Core.Environment.telegramSessionString);
    private client: TelegramClient = new TelegramClient(
        this.stringSession,
        Core.Environment.telegramApiId,
        Core.Environment.telegramApiHash, {
            appVersion: '1.0.0',
            deviceModel: 'SpectralAPI',
            langCode: 'en',
            connectionRetries: 5,
            requestRetries: 1,
            baseLogger: new Logger(LogLevel.ERROR),
        })

    private isConnected() {
        return this.client && !!this.client.connected;
    }

    public async getClient() {
        if (this.isConnected()) {
            return this.client;
        }

        await this.client.connect();
        await this.client.getMe();

        return this.client;
    }

    public async createSessionString() {
        await this.client.start({
            phoneNumber: async () => Core.Environment.telegramPhoneNumber,
            password: async () => Core.Environment.telegramPassword,
            phoneCode: async () => {
                const {code} = await inquirer.prompt([{
                    type: "input",
                    name: "code",
                    message: "Enter the code you received: ",
                }]);

                console.log(code)

                return code;
            },
            onError: (err) => console.log(err),
        });

        console.log("You should now be connected.");
        console.log("Store this session string into TELEGRAM_SESSION_STRING:", this.client.session.save());

        await this.client.sendMessage("me", {message: "Connected"});
    }
}
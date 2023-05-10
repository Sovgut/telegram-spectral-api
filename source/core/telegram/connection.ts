import {TelegramClient} from "telegram";
import {StringSession} from "telegram/sessions/StringSession.js";
import {Environment} from "~core/config.js";
import inquirer from "inquirer";

export class TelegramConnectionProvider {
    private stringSession: StringSession = new StringSession(Environment.telegramSessionString);
    private client: TelegramClient = new TelegramClient(
        this.stringSession,
        Environment.telegramApiId,
        Environment.telegramApiHash, {
            appVersion: '1.0.0',
            deviceModel: 'SpectralAPI',
            langCode: 'en',
            connectionRetries: 5,
            requestRetries: 1,
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
            phoneNumber: async () => Environment.telegramPhoneNumber,
            password: async () => Environment.telegramPassword,
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
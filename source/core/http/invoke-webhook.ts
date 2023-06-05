import axios from "axios";
import { type IWebhook } from "~database/models/webhook.js";

export async function invokeWebhook(webhook: IWebhook, payload: unknown): Promise<void | never> {
	const response = await axios.post(webhook.url, payload, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${webhook.token}`,
		},
	});

	if (!response.status.toString().startsWith("2")) {
		throw new Error(`Webhook returned ${response.status} ${response.statusText}`);
	}
}

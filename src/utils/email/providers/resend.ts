export class Resend implements EmailProvider {
	name: string = "Resend";

	/**
	 * Creates an instance of Resend email provider
	 * @param apiKey Resend API key
	 * @param unsubscribeURL optional unsubscribe URL to include in email headers
	 */
	constructor(
		private apiKey: string,
		private unsubscribeURL?: string | URL
	) {}

	async send({ from, to, replyTo, subject, html, text }: EmailPayload): Promise<void> {
		await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				authorization: `Bearer ${this.apiKey}`
			},
			body: JSON.stringify({
				from,
				to,
				// biome-ignore lint/style/useNamingConvention: The API expects snake_case keys
				reply_to: replyTo,
				subject,
				html,
				text,
				headers: this.unsubscribeURL
					? { "List-Unsubscribe": `<${this.unsubscribeURL}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" }
					: null
			})
		});
	}
}

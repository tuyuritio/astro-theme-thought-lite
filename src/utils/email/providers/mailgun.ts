export class Mailgun implements EmailProvider {
	name: string = "Mailgun";

	/**
	 * Creates a new Mailgun email provider.
	 * @param domain Email domain
	 * @param apiKey Mailgun API key
	 * @param unsubscribeURL optional unsubscribe URL to include in email headers
	 */
	constructor(
		private domain: string,
		private apiKey: string,
		private unsubscribeURL?: string | URL
	) {}

	async send({ from, to, replyTo, subject, html, text }: EmailPayload): Promise<void> {
		const form = new FormData();

		form.append("from", from);
		form.append("to", typeof to === "string" ? to : to.join(", "));
		if (replyTo) form.append("h:Reply-To", replyTo);
		form.append("subject", subject);
		if (html) form.append("html", html);
		if (text) form.append("text", text);
		if (this.unsubscribeURL) {
			form.append("h:List-Unsubscribe", `<${this.unsubscribeURL}>`);
			form.append("h:List-Unsubscribe-Post", "List-Unsubscribe=One-Click");
		}

		await fetch(`https://api.mailgun.net/v3/${this.domain}/messages`, {
			method: "POST",
			headers: {
				authorization: `Basic ${btoa(`api:${this.apiKey}`)}`
			},
			body: form
		});
	}
}

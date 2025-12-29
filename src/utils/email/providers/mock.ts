export class Mock implements EmailProvider {
	name = "Mock/Console";

	send({ from, to, replyTo, subject, html, text }: EmailPayload): Promise<void> {
		console.log("--- [MOCK EMAIL SENT] ---");
		console.log(`From: ${from}`);
		if (replyTo) console.log(`Reply-To: ${replyTo}`);
		console.log(`To: ${to}`);
		console.log(`Subject: ${subject}`);
		console.log(`Content: ${html || text}`);
		console.log("-------------------------");

		return Promise.resolve();
	}
}

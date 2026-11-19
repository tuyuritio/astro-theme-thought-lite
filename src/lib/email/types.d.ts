interface EmailPayload {
	from: string;
	to: string | string[];
	replyTo?: string;
	subject: string;
	html?: string;
	text?: string;
}

interface EmailProvider {
	name: string;
	send({ from, to, replyTo, subject, html, text }: EmailPayload): Promise<void>;
}

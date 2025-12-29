interface EmailPayload {
	from: string;
	to: string | string[];
	replyTo?: string;
	subject: string;
	html?: string;
	text?: string;
}

// biome-ignore lint/correctness/noUnusedVariables: Type definition
interface EmailProvider {
	name: string;
	send({ from, to, replyTo, subject, html, text }: EmailPayload): Promise<void>;
}

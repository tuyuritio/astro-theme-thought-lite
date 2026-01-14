import { Mock } from "./providers/mock";
import { Resend } from "./providers/resend";
import { Mailgun } from "./providers/mailgun";
import main from "./template/index.html?raw";
import verification from "./template/verification.html?raw";
import fresh from "./template/fresh.html?raw";
import reply from "./template/reply.html?raw";

const env = import.meta.env;

const templates = { main, verification, fresh, reply };

/**
 * Renders an email template by processing conditional blocks and variable injections.
 * @param template template name
 * @param params key-value pairs
 * @returns rendered email content
 *
 * Supported formats:
 *
 * Variables:
 * ```
 * %key%
 * ```
 *
 * Conditionals:
 * ```
 * %if key%
 * content
 * %endif%
 * ```
 */
export function render(template: keyof typeof templates, params?: Record<string, any>) {
	let text = templates[template];

	// Process conditional blocks
	text = text.replace(/%if\s+([\w.-]+?)%([\s\S]*?)%endif%/g, (_, key, content) => (params?.[key] ? content : ""));

	// Replace variable placeholders
	if (params) {
		text = text.replace(/%([\w.-]+?)%/g, (_, key) => params[key] ?? "");
	}

	return text;
}

/**
 * Sends an email using the configured provider.
 * @param payload email payload
 */
export async function send(payload: EmailPayload, unsubscribeURL?: string | URL) {
	let mailer: EmailProvider;

	if (env.RESEND_API_KEY) {
		mailer = new Resend(env.RESEND_API_KEY, unsubscribeURL);
	} else if (env.MAILGUN_API_KEY) {
		mailer = new Mailgun(env.MAILGUN_API_KEY, unsubscribeURL);
	} else {
		mailer = new Mock();
	}

	await mailer.send(payload);
}

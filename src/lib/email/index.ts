import { Mock } from "./providers/mock";
import { Resend } from "./providers/resend";
import { Mailgun } from "./providers/mailgun";
import main from "./template/index.html?raw";
import verification from "./template/verification.html?raw";
import fresh from "./template/fresh.html?raw";
import reply from "./template/reply.html?raw";

const env = import.meta.env;

const templates = { main, verification, fresh, reply };

const htmlEntities: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;"
};

function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, char => htmlEntities[char]);
}

/**
 * Renders an email template by processing conditional blocks and variable injections.
 * @param template template name
 * @param params key-value pairs
 * @returns rendered email content
 *
 * Supported formats:
 *
 * Escaped variables:
 * ```
 * %key%
 * ```
 *
 * Raw HTML variables:
 * ```
 * %%key%%
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

	// Replace variable placeholders (escape by default, allow raw HTML with %%key%%)
	if (params) {
		text = text.replace(/%%([\w.-]+?)%%|%([\w.-]+?)%/g, (_, rawKey, key) => {
			const value = params[rawKey ?? key];
			if (value == null) return "";
			return rawKey ? String(value) : escapeHtml(String(value));
		});
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

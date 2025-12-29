import { site } from "astro:config/client";
import { getRelativeLocaleUrl } from "astro:i18n";
import config from "$config";
import { AESEncryption } from "$utils/token";
import i18nit from "$i18n";
import { render, send } from "./index";

const env = import.meta.env;

/**
 * Sends an email to the specified address with the given payload.
 * @param locale locale code for the email content
 * @param drifter user identifier for generating unsubscribe link
 * @param email recipient email address
 * @param payload email payload including subject, html/text content, and unsubscribe option
 * @returns a promise that resolves when the email is sent
 */
export default async function sendEmail(
	locale: string,
	drifter: string,
	email: string,
	payload: { subject: string; html?: string; text?: string; unsubscribe?: boolean }
) {
	const t = i18nit(locale, "email");

	const policyURL = new URL(getRelativeLocaleUrl(locale, "/policy"), site);
	const unsubscribeURL = new URL(getRelativeLocaleUrl(locale, "/email/unsubscribe"), site);

	if (payload.unsubscribe) {
		const claim = new TextEncoder().encode(`${drifter}|${email}`);
		const pass = AESEncryption.encrypt(claim);
		if (!pass) throw new Error("Failed to generate unsubscribe token");

		unsubscribeURL.searchParams.set("pass", Buffer.from(pass).toString("base64url"));
	}

	if (payload.html) {
		payload.html = render("main", {
			language: locale,
			title: config.title,
			site,
			logo: new URL("/favicon-96x96.png", site),
			body: payload.html,
			year: config.copyright.year,
			author: config.author.name,
			unsubscribe: payload.unsubscribe,
			"unsubscribe.url": unsubscribeURL,
			"unsubscribe.button": t("unsubscribe"),
			"policy.url": policyURL,
			"policy.button": t("policy")
		});
	}

	return await send(
		{ from: env.EMAIL_FROM, to: email, replyTo: env.EMAIL_REPLY_TO, subject: payload.subject, html: payload.html, text: payload.text },
		unsubscribeURL
	);
}

import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import { getRelativeLocaleUrl } from "astro:i18n";
import { env } from "cloudflare:workers";
import { and, eq, ne } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import config, { email as enabled } from "$config";
import { Email } from "$db/schema";
import { render } from "$lib/email";
import sendEmail from "$lib/email/util";
import { AESEncryption, Token } from "$lib/token";
import i18nit from "$i18n";

export const email = {
	// Action to initiate email verification process
	verify: defineAction({
		input: z.object({
			locale: z.string(), // locale code for generating the link
			address: z.email().optional() // email address to verify, left empty to resend
		}),
		handler: async ({ locale, address }, { cookies, locals, site }) => {
			// Check if email feature is enabled
			if (!enabled) throw new ActionError({ code: "FORBIDDEN" });

			// Verify user authentication
			const drifter = (await Token.check(cookies, "passport"))?.visa;
			if (!drifter) throw new ActionError({ code: "UNAUTHORIZED" });

			// Validate locale against configured locales before rate-limiting or mutating state
			if (!(config.i18n.locales as readonly string[]).includes(locale)) throw new ActionError({ code: "BAD_REQUEST" });

			// Apply rate limiting to prevent spam
			const { success } = await env.EMAIL_LIMIT.limit({ key: drifter });
			if (!success) throw new ActionError({ code: "TOO_MANY_REQUESTS" });

			// Initialize database connection
			const db = drizzle(env.DB);

			if (address) {
				// Insert or update email record with pending state
				const result = await db
					.insert(Email)
					.values({ drifter, address, state: "pending" })
					.onConflictDoUpdate({
						target: Email.drifter,
						set: { address, state: "pending" },
						setWhere: ne(Email.address, address)
					})
					.returning();

				// Prevent updating with the same email address
				if (result.length === 0) throw new ActionError({ code: "CONFLICT" });
			} else {
				// Fetch existing email record for resending verification
				const result = await db
					.select({ address: Email.address })
					.from(Email)
					.where(and(eq(Email.drifter, drifter), eq(Email.state, "pending")))
					.get();

				if (!result) throw new ActionError({ code: "NOT_FOUND" });

				// Use existing address for resending
				address = result.address;
			}

			// Construct verification ticket
			const bytes = new TextEncoder().encode(`${drifter}|${address}`);
			const claim = new Uint8Array(8 + bytes.length);
			new DataView(claim.buffer).setBigUint64(0, BigInt(Date.now()), false);
			claim.set(bytes, 8);

			// Encrypt the ticket
			const ticket = AESEncryption.encrypt(claim);
			if (!ticket) throw new ActionError({ code: "INTERNAL_SERVER_ERROR" });

			// Generate verification link
			const link = new URL(getRelativeLocaleUrl(locale, "/email"), site);
			link.searchParams.set("ticket", Buffer.from(ticket).toString("base64url"));

			const t = i18nit(locale, "email");

			// Send verification email
			locals.cfContext.waitUntil(
				sendEmail(locale, drifter, address, {
					subject: t("verification.subject"),
					html: render("verification", {
						title: t("verification.html.title"),
						instruction: t("verification.html.instruction"),
						button: t("verification.html.button"),
						link
					}),
					text: t("verification.text", { link: link.toString() })
				})
			);
		}
	}),

	// Action to remove email record
	remove: defineAction({
		handler: async (_, { cookies }) => {
			// Check if email feature is enabled
			if (!enabled) throw new ActionError({ code: "FORBIDDEN" });

			// Verify user authentication
			const drifter = (await Token.check(cookies, "passport"))?.visa;
			if (!drifter) throw new ActionError({ code: "UNAUTHORIZED" });

			// Initialize database connection
			const db = drizzle(env.DB);

			// Remove email record
			await db.delete(Email).where(eq(Email.drifter, drifter));
		}
	})
};

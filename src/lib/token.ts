import type { AstroCookies } from "astro";
import { site } from "astro:config/server";
import crypto from "node:crypto";
import ms, { type StringValue } from "ms";
import { EncryptJWT, jwtDecrypt, type JWTPayload } from "jose";

// Character set for generating random strings
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// Master encryption key from environment variables
// The fallback value is the base64-encoded string of "DEFAULT_PASS_KEY"
const PASS_KEY = import.meta.env.PASS_KEY || "REVGQVVMVF9QQVNTX0tFWQo=";

/**
 * Generate a random string of specified length
 * @param length - Length of the random string to generate
 * @returns Random string composed of alphanumeric characters
 */
export const random = (length: number) =>
	new Array(length)
		.fill(null)
		.map(_ => characters.charAt(Math.floor(Math.random() * characters.length)))
		.join("");

/**
 * Create a hash of text with current timestamp for uniqueness
 * @param text - Text to hash
 * @returns SHA512 hash in base64url format with timestamp salt
 */
export function enhash(text: string): string {
	return crypto
		.createHash("SHA512")
		.update(text + new Date().toISOString())
		.digest("base64url");
}

// Token namespace for JWT-based authentication token management
export namespace Token {
	/**
	 * Issue a new encrypted JWT token and set it as an HTTP-only cookie
	 * @param cookies - Astro cookies object for setting the cookie
	 * @param name - Cookie name for the token
	 * @param payload - JWT payload data to encrypt
	 * @param expiration - Token expiration time (default: "60 days")
	 */
	export async function issue(
		cookies: AstroCookies,
		name: string,
		payload: JWTPayload,
		expiration: StringValue | number = "60 days"
	): Promise<void> {
		// Create encrypted JWT using direct encryption (dir) algorithm with A128GCM
		const token = await new EncryptJWT(payload)
			.setProtectedHeader({ alg: "dir", enc: "A128GCM" })
			.setExpirationTime(expiration)
			.encrypt(new Uint8Array(Buffer.from(PASS_KEY, "base64")));

		// Set secure HTTP-only cookie with proper domain and security settings
		cookies.set(name, token, {
			path: "/",
			domain: new URL(site!).hostname,
			maxAge: typeof expiration === "number" ? expiration : ms(expiration) / 1000,
			secure: true,
			httpOnly: true,
			sameSite: "lax"
		});
	}

	/**
	 * Verify and decrypt a JWT token from cookies with renewal
	 * @param cookies - Astro cookies object for reading the cookie
	 * @param name - Cookie name containing the token
	 * @param renew - Whether to renew token (default: true)
	 * @returns Decrypted JWT payload or null if invalid/missing
	 */
	export async function check(cookies: AstroCookies, name: string, renew: boolean = true): Promise<any> {
		try {
			if (!cookies.has(name)) return null;

			// Decrypt and verify the JWT token
			const result = await jwtDecrypt(cookies.get(name)!.value, new Uint8Array(Buffer.from(PASS_KEY, "base64")));
			const payload = result.payload as any;

			// Check if token should be renewed
			if (payload.exp && renew) {
				// Create new payload without exp claim (will be set by issue method)
				const { _exp, _iat, ...renewal } = payload;
				await issue(cookies, name, renewal);
			}

			return payload;
		} catch (_) {
			// Return null for invalid or expired tokens
			return null;
		}
	}

	/**
	 * Revoke a token by deleting its cookie
	 * @param name - Cookie name to delete
	 * @param cookies - Astro cookies object for deleting the cookie
	 */
	export async function revoke(name: string, cookies: AstroCookies): Promise<void> {
		if (!cookies.has(name)) return;
		cookies.delete(name, { path: "/", domain: new URL(site!).hostname });
	}
}

// AES namespace for symmetric encryption utilities
export namespace AESEncryption {
	// Derive 256-bit encryption key from master password
	const key = crypto.createHash("sha256").update(PASS_KEY).digest();

	/**
	 * Encrypt data using AES-256-GCM encryption
	 * @param data - Data to encrypt
	 * @returns Encrypted data (IV + AuthTag + Ciphertext) or null if encryption fails
	 */
	export function encrypt(data: Uint8Array): Uint8Array | null {
		try {
			// Generate random 12-byte initialization vector
			const iv = crypto.randomBytes(12);
			const cipher = crypto.createCipheriv("aes-256-gcm", new Uint8Array(key), new Uint8Array(iv));

			const encrypted = cipher.update(data);
			const final = cipher.final();
			const tag = cipher.getAuthTag();

			return new Uint8Array(Buffer.concat([new Uint8Array(iv), new Uint8Array(tag), new Uint8Array(encrypted), new Uint8Array(final)]));
		} catch (_) {
			return null;
		}
	}

	/**
	 * Decrypt data using AES-256-GCM decryption
	 * @param data - Encrypted data (IV + AuthTag + Ciphertext)
	 * @returns Decrypted data or null if decryption fails
	 */
	export function decrypt(data: Uint8Array): Uint8Array | null {
		try {
			const buffer = Buffer.from(data);

			const iv = buffer.subarray(0, 12); // Extract IV
			const tag = buffer.subarray(12, 28); // Extract Auth Tag
			const encrypted = buffer.subarray(28); // Extract Encrypted Data

			const decipher = crypto.createDecipheriv("aes-256-gcm", new Uint8Array(key), new Uint8Array(iv));
			decipher.setAuthTag(new Uint8Array(tag));

			const decrypted = decipher.update(new Uint8Array(encrypted));
			const final = decipher.final();

			return new Uint8Array(Buffer.concat([new Uint8Array(decrypted), new Uint8Array(final)]));
		} catch (_) {
			return null;
		}
	}
}

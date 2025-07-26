import type { AstroCookies } from "astro";
import { site } from "astro:config/server";
import crypto from "node:crypto";
import ms, { type StringValue } from "ms";
import { EncryptJWT, jwtDecrypt, type JWTPayload } from "jose";

// Character set for generating random strings
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// Master encryption key from environment variables
const PASS_KEY = import.meta.env.PASS_KEY;

/**
 * Generate a random string of specified length
 * @param length - Length of the random string to generate
 * @returns Random string composed of alphanumeric characters
 */
export const random = (length: number) => new Array(length).fill(null).map(_ => characters.charAt(Math.floor(Math.random() * characters.length))).join("");

/**
 * Create a hash of text with current timestamp for uniqueness
 * @param text - Text to hash
 * @returns SHA512 hash in base64url format with timestamp salt
 */
export function enhash(text: string): string {
	return crypto.createHash("SHA512").update(text + new Date().toISOString()).digest("base64url");
}

// Token namespace for JWT-based authentication token management
export namespace Token {
	/**
	 * Issue a new encrypted JWT token and set it as an HTTP-only cookie
	 * @param name - Cookie name for the token
	 * @param cookies - Astro cookies object for setting the cookie
	 * @param payload - JWT payload data to encrypt
	 * @param expiration - Token expiration time (default: "60 days")
	 */
	export async function issue(name: string, cookies: AstroCookies, payload: JWTPayload, expiration: StringValue | number = "60 days"): Promise<void> {
		// Create encrypted JWT using direct encryption (dir) algorithm with A128GCM
		const token = await new EncryptJWT(payload)
			.setProtectedHeader({ alg: "dir", enc: "A128GCM" })
			.setExpirationTime(expiration)
			.encrypt(Buffer.from(PASS_KEY, "base64"));

		// Set secure HTTP-only cookie with proper domain and security settings
		cookies.set(name, token, {
			path: "/",
			domain: new URL(site!).hostname,
			maxAge: typeof expiration == "number" ? expiration : ms(expiration) / 1000,
			secure: true,
			httpOnly: true,
			sameSite: "lax"
		});
	}

	/**
	 * Verify and decrypt a JWT token from cookies with renewal
	 * @param name - Cookie name containing the token
	 * @param cookies - Astro cookies object for reading the cookie
	 * @param renew - Whether to renew token (default: true)
	 * @returns Decrypted JWT payload or null if invalid/missing
	 */
	export async function check(name: string, cookies: AstroCookies, renew: boolean = true): Promise<any> {
		try {
			if (!cookies.has(name)) return null;

			// Decrypt and verify the JWT token
			const result = await jwtDecrypt(cookies.get(name)!.value, Buffer.from(PASS_KEY, "base64"));
			const payload = result.payload as any;

			// Check if token should be renewed
			if (payload.exp && renew) {
				// Create new payload without exp claim (will be set by issue method)
				const { exp, iat, ...renewal } = payload;
				await issue(name, cookies, renewal);
			}

			return payload;
		} catch (error) {
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
		if (cookies.has(name)) {
			cookies.delete(name, {
				path: "/",
				domain: new URL(site!).hostname,
				secure: true,
				httpOnly: true,
				sameSite: "lax"
			});
		}
	}
}

// AES namespace for symmetric encryption utilities
export namespace AES {
	// Derive 256-bit encryption key from master password
	const key = crypto.createHash("sha256").update(PASS_KEY).digest();

	/**
	 * Encrypt text using AES-256-CBC encryption
	 * @param text - Plain text to encrypt
	 * @returns Encrypted text in base64url format (includes IV) or null if encryption fails
	 */
	export function encrypt(text: string): string | null {
		try {
			// Generate random 16-byte initialization vector
			const iv = crypto.randomBytes(16);
			const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
			// Prepend IV to encrypted data for decryption
			return Buffer.concat([iv, cipher.update(text, "utf8"), cipher.final()]).toString("base64url");
		} catch (error) {
			return null;
		}
	}

	/**
	 * Decrypt text using AES-256-CBC decryption
	 * @param base64url - Encrypted text in base64url format (with IV prepended)
	 * @returns Decrypted plain text or null if decryption fails
	 */
	export function decrypt(base64url: string): string | null {
		try {
			const buffer = Buffer.from(base64url, "base64url");
			// Extract IV from first 16 bytes
			const iv = buffer.subarray(0, 16);
			// Extract encrypted data from remaining bytes
			const encryptedText = buffer.subarray(16);
			const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
			return Buffer.concat([decipher.update(encryptedText), decipher.final()]).toString("utf8");
		} catch (error) {
			return null;
		}
	}
}

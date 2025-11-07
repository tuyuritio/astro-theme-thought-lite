import { site } from "astro:config/server";
import { decodeIdToken, GitHub, Google, Twitter } from "arctic";

const env = import.meta.env;

// Interface defining the structure of OAuth account information
export interface OAuthAccount {
	platform: string; // OAuth provider name (GitHub, Google, X)
	access: string; // Access token for API calls
	expire?: Date; // Token expiration date (if applicable)
	refresh?: string; // Refresh token for token renewal (if applicable)
	account: string; // Unique account identifier from provider
	handle?: string; // Username/handle (if applicable)
	name: string; // Display name
	description?: string; // User bio/description (if applicable)
	image: string; // Profile image URL
}

// OAuth redirect URI for all providers
const REDIRECT_URI = `${site}/drifter/anchor`;

/**
 * User-Agent header required by GitHub API
 * @see https://docs.github.com/en/rest/using-the-rest-api/getting-started-with-the-rest-api?apiVersion=2022-11-28#user-agent
 */
const USER_AGENT = "ThoughtLiteOAuth/1.0";

/**
 * OAuth authentication helper class supporting multiple providers
 * Handles authorization URLs, token validation, profile updates, and token revocation
 */
export class OAuth {
	private provider;

	/**
	 * Initialize OAuth provider based on platform name
	 * @param platform - OAuth provider name ("GitHub", "Google", or "X")
	 * @throws Error if platform is invalid or required environment variables are missing
	 */
	constructor(platform?: string) {
		if (platform === "GitHub") {
			if (!(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET)) throw new Error("Missing Environment Variables");
			this.provider = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, `${REDIRECT_URI}/GitHub`);
		} else if (platform === "Google") {
			if (!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)) throw new Error("Missing Environment Variables");
			this.provider = new Google(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, `${REDIRECT_URI}/Google`);
		} else if (platform === "X") {
			if (!(env.TWITTER_CLIENT_ID && env.TWITTER_CLIENT_SECRET)) throw new Error("Missing Environment Variables");
			this.provider = new Twitter(env.TWITTER_CLIENT_ID, env.TWITTER_CLIENT_SECRET, `${REDIRECT_URI}/X`);
		} else {
			throw new Error("Invalid Provider");
		}
	}

	/**
	 * Generate authorization URL for OAuth flow
	 * @param state - CSRF protection state parameter
	 * @param codeVerifier - PKCE code verifier for enhanced security
	 * @returns Authorization URL to redirect user to
	 * @throws Error if provider is invalid
	 */
	url(state: string, codeVerifier: string): URL {
		if (this.provider instanceof GitHub) {
			return this.provider.createAuthorizationURL(state, []);
		} else if (this.provider instanceof Google) {
			const url = this.provider.createAuthorizationURL(state, codeVerifier, ["openid", "profile"]);
			url.searchParams.set("access_type", "offline"); // Request refresh token
			return url;
		} else if (this.provider instanceof Twitter) {
			return this.provider.createAuthorizationURL(state, codeVerifier, ["users.read", "tweet.read", "offline.access"]);
		} else {
			throw new Error("Invalid Provider");
		}
	}

	/**
	 * Validate authorization code and fetch user profile
	 * @param code - Authorization code from OAuth callback
	 * @param verifier - PKCE code verifier for validation
	 * @returns Promise<OAuthAccount> User account information from OAuth provider
	 * @throws Error if provider is invalid or API calls fail
	 */
	async validate(code: string, verifier: string): Promise<OAuthAccount> {
		const tokens = await this.provider.validateAuthorizationCode(code, verifier);
		const accessToken = tokens.accessToken();

		if (this.provider instanceof GitHub) {
			// Fetch user profile from GitHub API
			const response = await fetch("https://api.github.com/user", {
				headers: { authorization: `Bearer ${accessToken}`, "user-agent": USER_AGENT }
			});
			const user = await response.json();

			return {
				platform: "GitHub",
				access: accessToken,
				account: user.id.toString(),
				handle: user.login,
				name: user.name,
				description: user.bio,
				image: user.avatar_url
			};
		} else if (this.provider instanceof Google) {
			// Extract token information and decode ID token
			const expireAt = tokens.accessTokenExpiresAt();
			const refreshToken = tokens.hasRefreshToken() ? tokens.refreshToken() : undefined;
			const user: any = decodeIdToken(tokens.idToken());

			return {
				platform: "Google",
				access: accessToken,
				expire: expireAt,
				refresh: refreshToken,
				account: user.sub,
				name: user.name,
				image: user.picture
			};
		} else if (this.provider instanceof Twitter) {
			// Extract token information and fetch user profile from Twitter API
			const expireAt = tokens.accessTokenExpiresAt();
			const refreshToken = tokens.refreshToken();

			const response = await fetch("https://api.twitter.com/2/users/me?user.fields=description,profile_image_url", {
				headers: { authorization: `Bearer ${accessToken}`, "user-agent": USER_AGENT }
			});
			const user = (await response.json()).data;

			// Remove "_normal" suffix from Twitter profile image for higher resolution
			return {
				platform: "X",
				access: accessToken,
				expire: expireAt,
				refresh: refreshToken,
				account: user.id,
				handle: user.username,
				name: user.name,
				description: user.description,
				image: user.profile_image_url.replace("_normal", "")
			};
		} else {
			throw new Error("Invalid Provider");
		}
	}

	/**
	 * Update user profile information by fetching fresh data from OAuth provider
	 * Handles token refresh if expired
	 * @param token - Current access token or refresh token
	 * @param expire - Whether the token has expired and needs refresh
	 * @returns Promise<OAuthAccount> Updated user account information
	 * @throws Error if provider is invalid or API calls fail
	 */
	async update(token: string, expire: boolean): Promise<OAuthAccount> {
		if (this.provider instanceof GitHub) {
			// GitHub tokens don't expire, fetch fresh profile data
			const response = await fetch("https://api.github.com/user", { headers: { authorization: `Bearer ${token}`, "user-agent": USER_AGENT } });
			const user = await response.json();

			return {
				platform: "GitHub",
				access: token,
				account: user.id.toString(),
				handle: user.login,
				name: user.name,
				description: user.bio,
				image: user.avatar_url
			};
		} else if (this.provider instanceof Google) {
			let expireAt: Date | undefined;
			// Refresh access token if expired
			if (expire) {
				const tokens = await this.provider.refreshAccessToken(token);
				token = tokens.accessToken();
				expireAt = tokens.accessTokenExpiresAt();
			}

			// Fetch fresh profile data from Google API
			const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
				headers: { authorization: `Bearer ${token}`, "user-agent": USER_AGENT }
			});
			const user = await response.json();

			return { platform: "Google", access: token, expire: expireAt, account: user.sub, name: user.name, image: user.picture };
		} else if (this.provider instanceof Twitter) {
			let expireAt: Date | undefined;
			// Refresh access token if expired
			if (expire) {
				const tokens = await this.provider.refreshAccessToken(token);
				token = tokens.accessToken();
				expireAt = tokens.accessTokenExpiresAt();
			}

			// Fetch fresh profile data from Twitter API
			const response = await fetch("https://api.twitter.com/2/users/me?user.fields=description,profile_image_url", {
				headers: { authorization: `Bearer ${token}`, "user-agent": USER_AGENT }
			});
			const user = (await response.json()).data;

			// Remove "_normal" suffix from Twitter profile image for higher resolution
			return {
				platform: "X",
				access: token,
				expire: expireAt,
				account: user.id,
				handle: user.username,
				name: user.name,
				description: user.description,
				image: user.profile_image_url.replace("_normal", "")
			};
		} else {
			throw new Error("Invalid Provider");
		}
	}

	/**
	 * Revoke OAuth access token to invalidate authorization
	 * @param token - Access token to revoke
	 * @throws Error if provider is invalid or revocation fails
	 */
	async revoke(token: string): Promise<void> {
		if (this.provider instanceof GitHub) {
			// GitHub doesn't provide a direct revoke endpoint for OAuth apps
			// Tokens can only be revoked manually from GitHub settings
			return;
		} else if (this.provider instanceof Google) {
			// Use Google's built-in token revocation
			await this.provider.revokeToken(token);
		} else if (this.provider instanceof Twitter) {
			// Manual implementation for Twitter token revocation
			// @see https://github.com/pilcrowonpaper/arctic/issues/314
			await fetch("https://api.twitter.com/2/oauth2/revoke", {
				method: "POST",
				headers: {
					"content-type": "application/x-www-form-urlencoded",
					"user-agent": USER_AGENT,
					// Basic authentication using client credentials
					authorization: `Basic ${btoa(`${env.TWITTER_CLIENT_ID}:${env.TWITTER_CLIENT_SECRET}`)}`
				},
				body: `token=${encodeURIComponent(token)}&token_type_hint=access_token`
			});
		} else {
			throw new Error("Invalid Provider");
		}
	}
}

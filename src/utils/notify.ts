import { buildPushPayload, type PushSubscription, type PushMessage, type VapidKeys } from "@block65/webcrypto-web-push";
import config from "$config";

const env = import.meta.env;

// VAPID (Voluntary Application Server Identification) keys for web push authentication
// These keys are used to identify the application server to push services
const VAPID: VapidKeys = {
	subject: config.author.email, // Contact email for the application server
	publicKey: env.NOTIFY_PUBLIC_KEY, // Public key for VAPID authentication
	privateKey: env.NOTIFY_PRIVATE_KEY // Private key for VAPID authentication
};

/**
 * Send push notification to a user's subscription endpoint
 * @param subscription - Push subscription details including endpoint and encryption keys
 * @param subscription.endpoint - Push service endpoint URL
 * @param subscription.auth - Authentication secret for message encryption
 * @param subscription.p256dh - Public key for message encryption (P-256 ECDH)
 * @param data - Notification content and metadata
 * @param data.title - Notification title (required)
 * @param data.body - Notification body text (optional)
 * @param data.url - URL to open when notification is clicked (optional)
 * @returns Promise<boolean> - true if sent successfully, false if subscription is invalid/expired
 */
export default async function notify(
	subscription: { endpoint: string; auth: string; p256dh: string },
	data: { title: string; body?: string; url?: string }
): Promise<boolean> {
	// Convert subscription data to standard PushSubscription format
	const push: PushSubscription = {
		endpoint: subscription.endpoint!,
		expirationTime: null,
		keys: {
			p256dh: subscription.p256dh!,
			auth: subscription.auth!
		}
	};

	// Prepare push message with notification data and delivery options
	const message: PushMessage = {
		data: {
			title: data.title,
			body: data.body,
			url: data.url,
			timestamp: Date.now() // Add timestamp for client-side handling
		},
		options: {
			ttl: 60 * 60 * 24 // Time-to-live: 24 hours in seconds
		}
	};

	// Build encrypted payload using VAPID authentication
	const payload: any = await buildPushPayload(message, push, VAPID);

	// Send push notification to the push service
	const response = await fetch(push.endpoint, payload);
	if (response.ok) {
		return true; // Notification sent successfully
	} else if (response.status === 410 || response.status === 404) {
		// 410 Gone or 404 Not Found indicates the subscription is invalid/expired
		return false;
	} else {
		throw new Error(`Failed to send notification: ${response.status} ${response.statusText}`);
	}
}

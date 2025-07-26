import { Swup } from "@swup/astro/client";

declare global {
	interface Window {
		swup: Swup;
		turnstile: any;
		onloadTurnstileCallback: () => void;
	}
}

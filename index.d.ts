import { Swup } from "@swup/astro/client";

declare global {
	interface Window {
		swup: Swup;
		zoom: () => void;
	}
}

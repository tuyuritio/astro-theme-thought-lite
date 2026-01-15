import type { Swup } from "@swup/astro/client";

declare global {
	interface Window {
		swup: Swup;
		zoom: () => void;
	}

	declare module "*.yaml" {
		const content: Record<string, any>;
		export default content;
	}
}

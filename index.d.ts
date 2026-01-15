import type { Swup } from "@swup/astro/client";

declare global {
	interface Window {
		swup: Swup;
		zoom: () => void;
		turnstile: any;
		onloadTurnstileCallback: () => void;
	}

	declare namespace App {
		interface Locals {
			runtime: {
				env: Env;
				ctx: ExecutionContext;
			};
		}
	}

	declare module "*.yaml" {
		const content: Record<string, any>;
		export default content;
	}
}

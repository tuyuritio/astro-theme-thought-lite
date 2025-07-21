declare namespace App {
	interface Locals {
		test: number;
		runtime: {
			env: any;
			ctx: {
				waitUntil: (promise: Promise<any>) => void;
			};
		};
	}
}

declare module "*.yaml" {
	const content: Record<string, any>;
	export default content;
}

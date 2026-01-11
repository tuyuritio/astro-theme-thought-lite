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

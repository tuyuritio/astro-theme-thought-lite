import type { AstroIntegration } from "astro";
import type { Plugin } from "vite";

// --- Vite Virtual Module Definition ---

/**
 * Public ID of the virtual module (used by users in imports)
 */
const VIRTUAL_MODULE_ID = "astro:locales";

/**
 * Internally resolved ID by Vite/Rollup (convention uses \0 prefix)
 */
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;

/**
 * Options type received by the plugin factory
 */
interface VirtualModuleOptions {
	monolocale: boolean;
}

/**
 * Factory function to create a Vite plugin instance
 * (This is an internal helper function, does not need to be exported)
 *
 * @param options Object containing monolocale boolean value
 * @returns A Vite plugin instance
 */
function createVirtualModulePlugin(options: VirtualModuleOptions): Plugin {
	const { monolocale } = options;

	return {
		// Plugin name, used for debugging
		name: "vite-plugin-monolocale",

		/**
		 * Vite/Rollup hook
		 * Responsible for resolving our virtual module ID.
		 */
		resolveId(id) {
			if (id === VIRTUAL_MODULE_ID) {
				return RESOLVED_VIRTUAL_MODULE_ID;
			}
		},

		/**
		 * Vite/Rollup hook
		 * Responsible for "loading" the content of the virtual module when requested by Vite.
		 */
		load(id) {
			if (id === RESOLVED_VIRTUAL_MODULE_ID) {
				// Dynamically generate module content
				return `export const monolocale = ${monolocale};`;
			}
		}
	};
}

// --- Astro Integration Definition ---

/**
 * Astro integration factory function
 * This is the default export you will import from astro.config.mjs
 */
export default function monolocaleIntegration(): AstroIntegration {
	return {
		// Unique name of the integration
		name: "astro-monolocale-integration",

		hooks: {
			/**
			 * 'astro:config:setup' hook
			 * Read configuration and inject Vite plugin here.
			 */
			"astro:config:setup": params => {
				const { config, updateConfig, logger } = params;

				// 1. Safely read Astro i18n configuration
				// Calculate 'monolocale' status
				const monolocale = (config.i18n?.locales?.length ?? 0) === 1;

				// 2. (Optional) Print log for debugging
				logger.info(`i18n integration: monolocale = ${monolocale}`);

				// 3. Instantiate our internal Vite plugin factory
				const virtualModulePlugin = createVirtualModulePlugin({
					monolocale: monolocale
				});

				// 4. Inject the plugin into Astro using 'updateConfig'
				updateConfig({
					vite: {
						plugins: [virtualModulePlugin]
					}
				});
			},

			/**
			 * 'astro:config:done' hook
			 * Responsibility: Automatically inject type definitions for IDE auto-completion.
			 */
			"astro:config:done": params => {
				const { injectTypes } = params;

				// 5. Define the content of the .d.ts file
				const typesContent = `
declare module 'astro:locales' {
  /**
   * True if there is only one locale in the Astro i18n configuration.
   */
  export const monolocale: boolean;
}
        `;

				// 6. Inject types
				injectTypes({
					filename: "monolocale.d.ts",
					content: typesContent
				});
			}
		}
	};
}

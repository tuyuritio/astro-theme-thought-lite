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
	multilocales: boolean;
}

/**
 * Factory function to create a Vite plugin instance
 * (This is an internal helper function, does not need to be exported)
 *
 * @param options Object containing locale configuration values
 * @returns A Vite plugin instance
 */
function createVirtualModulePlugin(options: VirtualModuleOptions): Plugin {
	const { monolocale, multilocales } = options;

	return {
		// Plugin name, used for debugging
		name: "vite-plugin-astro-locales",

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
				return `export const monolocale = ${monolocale};
export const multilocales = ${multilocales};`;
			}
		}
	};
}

// --- Astro Integration Definition ---

/**
 * Astro integration factory function
 * This is the default export you will import from astro.config.mjs
 */
export default function localesIntegration(): AstroIntegration {
	return {
		// Unique name of the integration
		name: "astro-locales-integration",

		hooks: {
			/**
			 * 'astro:config:setup' hook
			 * Read configuration and inject Vite plugin here.
			 */
			"astro:config:setup": params => {
				const { config, updateConfig, logger } = params;

				// Read Astro i18n configuration and determine locale status
				const monolocale = (config.i18n?.locales?.length ?? 0) === 1;
				const multilocales = (config.i18n?.locales?.length ?? 0) > 1;

				// Print log for debugging
				logger.info(`i18n integration: ${monolocale ? "monolingual" : "multilingual"} mode`);

				// Instantiate internal Vite plugin factory
				const virtualModulePlugin = createVirtualModulePlugin({
					monolocale: monolocale,
					multilocales: multilocales
				});

				// Inject the plugin into Astro
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

				// Define the content of the .d.ts file
				const typesContent = `
declare module 'astro:locales' {
  /**
   * True if there is only one locale in the Astro i18n configuration.
   */
  export const monolocale: boolean;
  
  /**
   * True if there are multiple locales in the Astro i18n configuration.
   */
  export const multilocales: boolean;
}
`;

				// Inject types
				injectTypes({
					filename: "astro-locales.d.ts",
					content: typesContent
				});
			}
		}
	};
}

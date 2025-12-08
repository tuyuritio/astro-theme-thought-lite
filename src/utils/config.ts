/**
 * Creative Commons 4.0 License Type
 */
type CCLicenseType = "CC0 1.0" | "CC BY 4.0" | "CC BY-SA 4.0" | "CC BY-NC 4.0" | "CC BY-NC-SA 4.0" | "CC BY-ND 4.0" | "CC BY-NC-ND 4.0";

/**
 * Content Section Type
 */
type Section = "note" | "jotting";

interface SiteConfigOptions<Locales extends readonly string[] = readonly string[]> {
	/** Site Title */
	title: string;

	/** Site Prologue */
	prologue?: string;

	/** Author Information */
	author: {
		/** Author Name */
		name: string;

		/** Author Email */
		email?: string;

		/** Author Homepage Link */
		link?: string;
	};

	/** Site Description */
	description: string;

	/** Creative Commons License Configuration */
	copyright: {
		/** Creative Commons 4.0 License Type */
		type: CCLicenseType;

		/** License Year */
		year: string;
	};

	/** Internationalization Configuration */
	i18n: {
		/** Supported Locales */
		locales: Locales;

		/** Default Locale (must be one of the locales) */
		defaultLocale: Locales[number];
	};

	/** Feed Configuration */
	feed?: {
		/** Feed Sections */
		section?: "*" | Section[];

		/** Feed Item Limit */
		limit?: number;
	};

	/** Comment Configuration */
	comment?: {
		/** Maximum Comment Length */
		"max-length"?: number;

		/** Hide top-level deleted comments without replies */
		"hide-deleted"?: boolean;

		/** Show edit history */
		history?: boolean;
	};

	/** Latest Content Display */
	latest?: "*" | Section[];
}

/**
 * Define site configuration with type-safe locale settings.
 *
 * This function is intentionally a pass-through to leverage TypeScript's type inference and validation at compile time.
 * If runtime validation is needed, add checks for required fields and value correctness here.
 * @param config - Site configuration options
 * @returns The validated site configuration
 */
export default function siteConfig<const Locales extends string[]>(config: SiteConfigOptions<Locales>): SiteConfigOptions<Locales> {
	return config;
}

/**
 * Processes the list of clients and returns valid authentication providers.
 * It filters out any clients missing a `clientID` or `clientSecret`.
 *
 * @param clients - The raw array of client configuration objects.
 * @returns An array of sanitized provider objects.
 */
export function providers(
	clients: Array<{ name: string; logo: string; clientID: string; clientSecret: string }>
): Array<{ name: string; logo: string }> {
	return clients.filter(client => client.clientID && client.clientSecret).map(({ name, logo }) => ({ name, logo }));
}

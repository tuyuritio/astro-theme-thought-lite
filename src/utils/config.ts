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

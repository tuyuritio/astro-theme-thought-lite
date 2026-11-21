// Import translation files for different locales
import en from "./en/index.yaml";
import enScript from "./en/script.yaml";
import enLinkroll from "./en/linkroll.yaml";
import enEmail from "./en/email.yaml";
import zhCN from "./zh-cn/index.yaml";
import zhCNScript from "./zh-cn/script.yaml";
import zhCNLinkroll from "./zh-cn/linkroll.yaml";
import zhCNEmail from "./zh-cn/email.yaml";
import ja from "./ja/index.yaml";
import jaScript from "./ja/script.yaml";
import jaLinkroll from "./ja/linkroll.yaml";
import jaEmail from "./ja/email.yaml";

// Translation object mapping locale codes to their respective translation data
const translations = {
	en: {
		index: en,
		script: enScript,
		linkroll: enLinkroll,
		email: enEmail
	},
	"zh-cn": {
		index: zhCN,
		script: zhCNScript,
		linkroll: zhCNLinkroll,
		email: zhCNEmail
	},
	ja: {
		index: ja,
		script: jaScript,
		linkroll: jaLinkroll,
		email: jaEmail
	}
};

// Define Language type based on available translations
type Language = keyof typeof translations;

// Define Namespace type based on keys in the translation objects
type TranslationNamespace = keyof (typeof translations)[Language];

/**
 * Validate if the provided language is supported
 * @param language - The target language/locale code
 * @throws Error if the language is not supported
 */
function validateLanguage(language: string): asserts language is Language {
	if (!(language in translations)) throw new Error(`Unsupported language: ${language}. Available: ${Object.keys(translations).join(", ")}`);
}

/**
 * Create an internationalization function for a specific language
 * @param language - The target language/locale code
 * @param namespace - Optional namespace prefix to prepend to all translation keys
 * @returns Translation function that can translate keys with parameter substitution
 */
export default function i18nit(
	language: string,
	namespace?: TranslationNamespace
): (key: string, params?: Record<string, string | number>) => string {
	// Ensure the provided language is valid
	validateLanguage(language);

	// Select the appropriate translation dictionary based on language and namespace
	const dictionary = translations[language][namespace ?? "index"];

	// Initialize pluralization rules for the specified language
	const rules = new Intl.PluralRules(language);

	/**
	 * Main translation function with parameter interpolation
	 * Navigates through nested translation object using dot notation and supports parameter substitution
	 * @param key - Dot-separated key path to look up translation
	 * @param params - Optional parameters for string interpolation (replaces {paramName} placeholders)
	 * @returns Translated and interpolated string, or the original key if translation not found
	 */
	function t(key: string, params?: Record<string, string | number>): string {
		const keys = key.split(".");
		let value: any = dictionary;

		// Navigate through the nested translation object
		for (const key of keys) {
			if (value === undefined || value === null) break;
			value = value[key];
		}

		// Handle pluralization if value is an object and 'count' parameter is provided
		if (value && typeof value === "object" && params?.count !== undefined && typeof params.count === "number") {
			// Determine the pluralization rule for the given count
			const rule = rules.select(params.count);

			// Select the appropriate plural form or fallback to 'other'
			const plural = value[rule] || value.other;
			if (typeof plural === "string") value = plural;
		}

		// Return the original key if translation not found
		if (value === undefined || typeof value !== "string") return key;

		// Perform parameter interpolation
		if (params) return value.replace(/\{(\w+)\}/g, (_, param) => String(params[param] ?? `{${param}}`));

		return value;
	}

	return t;
}

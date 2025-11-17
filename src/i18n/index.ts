// Import translation files for different locales
import en from "./en/index.yaml";
import enScript from "./en/script.yaml";
import enLinkroll from "./en/linkroll.yaml";
import zhCN from "./zh-cn/index.yaml";
import zhCNScript from "./zh-cn/script.yaml";
import zhLinkroll from "./zh-cn/linkroll.yaml";
import ja from "./ja/index.yaml";
import jaScript from "./ja/script.yaml";
import jaLinkroll from "./ja/linkroll.yaml";

// Translation object mapping locale codes to their respective translation data
const translations = {
	en: {
		...en,
		script: enScript,
		linkroll: enLinkroll
	},
	"zh-cn": {
		...zhCN,
		script: zhCNScript,
		linkroll: zhLinkroll
	},
	ja: {
		...ja,
		script: jaScript,
		linkroll: jaLinkroll
	}
};

// Define Language type based on available translations
type Language = keyof typeof translations;

// Define Namespace type based on keys in the translation objects
export type TranslationNamespace = keyof (typeof translations)[Language];

/**
 * Validate if the provided language is supported
 * @param language - The target language/locale code (e.g., "en", "zh-cn", "ja")
 * @throws Error if the language is not supported
 */
function validateLanguage(language: string): asserts language is Language {
	if (!Object.keys(translations).includes(language)) throw new Error(`Unsupported language: ${language}`);
}

/**
 * Create an internationalization function for a specific language
 * @param language - The target language/locale code (e.g., "en", "zh-cn", "ja")
 * @param namespace - Optional namespace prefix to prepend to all translation keys (e.g., "script")
 * @returns Translation function that can translate keys with parameter substitution
 */
export default function i18nit(
	language: string,
	namespace?: TranslationNamespace
): (key: string, params?: Record<string, string | number>) => string {
	// Ensure the provided language is valid
	validateLanguage(language);

	let translation: Record<string, any> = translations[language];
	if (namespace) translation = translation[namespace];

	/**
	 * Main translation function with parameter interpolation
	 * Navigates through nested translation object using dot notation and supports parameter substitution
	 * @param key - Dot-separated key path to look up translation (e.g., "notification.reply.title")
	 * @param params - Optional parameters for string interpolation (replaces {paramName} placeholders)
	 * @returns Translated and interpolated string, or the original key if translation not found
	 */
	function t(key: string, params?: Record<string, string | number>) {
		const keys = key.split(".");
		const value: string | undefined = keys.reduce((translation: any, key) => translation[key], translation);

		return value?.replace(/\{(\w+)\}/g, (_, param) => String(params?.[param] ?? param)) ?? key;
	}

	return t;
}

import fs from "node:fs";
import path from "node:path";

// Directory to cache downloaded fonts
const CACHE_DIR = path.resolve(process.cwd(), "node_modules", ".cache", "og-fonts");

// Locale-specific font URLs
const fonts: Record<string, string> = {
	en: "https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSerif/unhinted/otf/NotoSerif-Bold.otf",
	"zh-cn": "https://raw.githubusercontent.com/adobe-fonts/source-han-serif/release/OTF/SimplifiedChinese/SourceHanSerifSC-Bold.otf",
	ja: "https://raw.githubusercontent.com/adobe-fonts/source-han-serif/release/OTF/Japanese/SourceHanSerif-Bold.otf"
};

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

/**
 * Load font for the specified locale, downloading and caching it if necessary.
 * @param locale locale code
 * @returns ArrayBuffer of the font data
 */
export async function loadFont(locale: string) {
	const url = fonts[locale];
	if (!url) throw new Error(`No font URL found for locale: ${locale}`);

	const fileName = path.basename(url);
	const filePath = path.join(CACHE_DIR, fileName);

	if (fs.existsSync(filePath)) return fs.promises.readFile(filePath).then(buffer => buffer.buffer);

	const response = await fetch(url);
	if (!response.ok) throw new Error(`Failed to load font from ${url}: ${response.status} ${response.statusText}`);

	const buffer = await response.arrayBuffer();
	await fs.promises.writeFile(filePath, new Uint8Array(buffer));

	return buffer;
}

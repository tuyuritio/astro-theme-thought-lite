import satori from "satori";
import icon from "$icons/site-logo.svg?raw";

// Locale-specific Noto Serif font mappings for Google Fonts
const notoFonts: Record<string, string> = {
	en: "Noto+Serif",
	"zh-cn": "Noto+Serif+SC",
	ja: "Noto+Serif+JP"
};

export default async ({ locale, title, description, author }: { locale: string; title: string; description: string; author: string }) => {
	return await satori(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: "1.5rem"
			}}
		>
			<img src={`data:image/svg+xml;base64,${Buffer.from(icon).toString("base64")}`} alt="LOGO" width={120} height={120} />
			<span style={{ fontSize: "4rem", fontWeight: 900, color: "#1a1a1a", textAlign: "center" }}>{title}</span>
			<span style={{ fontSize: "1.75rem", color: "#888888", textAlign: "center", maxWidth: "75%" }}>{description}</span>
			<span style={{ marginTop: "3rem", borderBottom: "2px solid", padding: "0 0.5rem", fontSize: "1.5rem", color: "#666666" }}>{author}</span>
		</div>,
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: "Serif",
					data: await loadGoogleFont(locale, [...new Set(`${title}${author}${description}`)].join(""))
				}
			]
		}
	);
};

/**
 * Dynamically loads a Google Font subset containing only the required characters.
 * This optimization reduces font file size by requesting only the glyphs needed for rendering.
 *
 * @param locale - The locale code to determine which Noto Serif variant to load
 * @param text - The text content to extract required characters from
 * @returns ArrayBuffer containing the font data
 * @throws Error if the font URL cannot be extracted from Google Fonts CSS
 */
async function loadGoogleFont(locale: string, text: string) {
	const url = `https://fonts.googleapis.com/css2?family=${notoFonts[locale]}:wght@900&text=${encodeURIComponent(text)}`;
	const css = await (await fetch(url)).text();
	const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype|woff2?)'\)/);

	if (!resource) throw new Error("Failed to load font url");

	const response = await fetch(resource[1]);
	return response.arrayBuffer();
}

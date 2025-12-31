import satori from "satori";
import sharp from "sharp";
import icon from "$public/favicon.svg?raw";
import config from "$config";

/**
 * Metadata for content (note or jotting) used in Open Graph image generation
 */
interface ContentMeta {
	/** Locale code */
	locale: string;

	/** Content type label */
	type: string;

	/** Content title */
	title: string;

	/** Formatted timestamp (YYYY/MM/DD) */
	timestamp: string;

	/** Series name */
	series?: string;

	/** Tags associated with the content */
	tags?: string[];
}

/**
 * Map storing metadata for all content items, keyed by content ID.
 * Populated during static path generation to enable font caching optimization.
 */
export const contentMap = new Map<string, ContentMeta>();

/**
 * Font configuration for each locale with caching support.
 * The buffer is lazily loaded and cached on first use per locale.
 */
export const fonts: Record<string, { name: string; text?: string; buffer?: ArrayBuffer }> = {
	en: { name: "Noto Serif" },
	"zh-cn": { name: "Noto Serif SC" },
	ja: { name: "Noto Serif JP" }
};

/**
 * Loads and caches a Google Font for the specified content's locale.
 * On first call for a locale, collects all text from contents of that locale,
 * deduplicates characters, and fetches a subset font from Google Fonts.
 * Subsequent calls for the same locale return the cached font buffer.
 *
 * @param id - The content ID to load font for
 * @returns ArrayBuffer containing the font data
 * @throws Error if the content ID is not found in contentMap or font loading fails
 */
async function loadGoogleFont(id: string) {
	const locale = contentMap.get(id)?.locale;
	if (!locale) throw new Error(`Locale "${locale}" not found`);

	const font = fonts[locale];

	if (font.buffer) {
		return font.buffer;
	} else {
		font.text = config.title + config.author.name;

		const contents = Array.from(contentMap.values()).filter(content => content.locale === locale);
		font.text += contents.map(content => content.type + content.title + content.timestamp + content.series + content.tags).join("");

		font.text = Array.from(new Set(font.text.split(""))).join("");

		const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.name)}:wght@900&text=${font.text}`;

		const css = await (await fetch(url)).text();
		const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype|woff2?)'\)/);

		if (!resource) throw new Error("Failed to load font url");

		const response = await fetch(resource[1]);
		font.buffer = await response.arrayBuffer();

		return font.buffer;
	}
}

/*
<div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "3rem", width: "100%", height: "100%", background: "#fffffd" }}>
	<div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flexGrow: 1 }}>
		<span style={{ alignSelf: "flex-start", borderLeft: "0.5rem solid black", padding: "0.25rem 1rem 0.75rem", fontSize: "1.5rem" }}>
			{contentType}
			{series && (
				<span>
					<span style={{ padding: "0 0.5rem" }}>·</span>
					{series}
				</span>
			)}
		</span>
		<span style={{ fontSize: "4rem" }}>{title}</span>
		<div style={{ display: "flex", gap: "1rem", alignItems: "center", fontSize: "1.25rem", color: "#555555" }}>
			<time>{time}</time>
			{!!tags?.length && [
				<span key="separator" style={{ height: "100%", borderLeft: "0.125rem solid" }} />,
				tags.map(tag => <span key={tag}>#{tag}</span>)
			]}
		</div>
	</div>
	<hr style={{ margin: "2.5rem 0 2rem", borderTop: "0.25rem solid black" }} />
	<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
		<div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
			<img src={`data:image/svg+xml;base64,${Buffer.from(icon).toString("base64")}`} alt="LOGO" height={48} />
			<span style={{ fontSize: "2rem" }}>{site}</span>
		</div>
		<div style={{ fontSize: "1.5rem" }}>{author}</div>
	</div>
</div>
*/

/**
 * Generates an Open Graph image (1200x630 PNG) for the specified content.
 * Uses satori to render SVG from virtual DOM and sharp for PNG conversion.
 *
 * @param id - The content ID to generate image for
 * @returns Buffer containing the PNG image data
 * @throws Error if the content ID is not found in contentMap
 */
export default async (id: string) => {
	const content = contentMap.get(id);
	if (!content) throw new Error(`Content with id "${id}" not found`);

	const svg = await satori(
		{
			type: "div",
			props: {
				style: {
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: "3rem",
					width: "100%",
					height: "100%",
					background: "#fffffd"
				},
				children: [
					{
						type: "div",
						props: {
							style: {
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
								flexGrow: 1
							},
							children: [
								{
									type: "span",
									props: {
										style: {
											alignSelf: "flex-start",
											borderLeft: "0.5rem solid black",
											padding: "0.25rem 1rem 0.75rem",
											fontSize: "1.5rem"
										},
										children: [
											content.type,
											content.series
												? {
														type: "span",
														props: {
															children: [
																{
																	type: "span",
																	props: {
																		style: { padding: "0 0.5rem" },
																		children: "·"
																	}
																},
																content.series
															]
														}
													}
												: null
										]
									}
								},
								{
									type: "span",
									props: {
										style: { fontSize: "4rem" },
										children: content.title
									}
								},
								{
									type: "div",
									props: {
										style: {
											display: "flex",
											gap: "1rem",
											alignItems: "center",
											fontSize: "1.25rem",
											color: "#555555"
										},
										children: [
											{
												type: "time",
												props: { children: content.timestamp }
											},
											...(content.tags?.length
												? [
														{
															type: "span",
															key: "separator",
															props: {
																style: {
																	height: "100%",
																	borderLeft: "0.125rem solid"
																}
															}
														},
														...content.tags.map(tag => ({
															type: "span",
															key: tag,
															props: { children: `#${tag}` }
														}))
													]
												: [])
										]
									}
								}
							]
						}
					},
					{
						type: "hr",
						props: {
							style: {
								margin: "2.5rem 0 2rem",
								borderTop: "0.25rem solid black"
							}
						}
					},
					{
						type: "div",
						props: {
							style: {
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between"
							},
							children: [
								{
									type: "div",
									props: {
										style: {
											display: "flex",
											alignItems: "center",
											gap: "1rem"
										},
										children: [
											{
												type: "img",
												props: {
													src: `data:image/svg+xml;base64,${Buffer.from(icon).toString("base64")}`,
													alt: "LOGO",
													height: 48
												}
											},
											{
												type: "span",
												props: {
													style: { fontSize: "2rem" },
													children: config.title
												}
											}
										]
									}
								},
								{
									type: "div",
									props: {
										style: { fontSize: "1.5rem" },
										children: config.author.name
									}
								}
							]
						}
					}
				]
			}
		},
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: "Serif",
					data: await loadGoogleFont(id)
				}
			]
		}
	);

	return sharp(Buffer.from(svg)).resize(1200).png().toBuffer();
};

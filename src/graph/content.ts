import satori from "satori";
import sharp from "sharp";
import i18nit from "$i18n";
import icon from "$public/favicon.svg?raw";

// Locale-specific Noto Serif font mappings for Google Fonts
const notoFonts: Record<string, string> = {
	en: "Noto+Serif",
	"zh-cn": "Noto+Serif+SC",
	ja: "Noto+Serif+JP"
};

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

export default async ({
	locale,
	type,
	site,
	author,
	title,
	timestamp,
	series,
	tags
}: {
	locale: string;
	type: string;
	site: string;
	author: string;
	title: string;
	timestamp: Date;
	series?: string;
	tags?: string[];
}) => {
	const t = i18nit(locale);

	const contentType = t(`navigation.${type}`);
	const time = timestamp.toISOString().split("T")[0].replace(/-/g, "/");

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
											contentType,
											series
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
																series
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
										children: title
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
												props: { children: time }
											},
											...(tags?.length
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
														...tags.map(tag => ({
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
													children: site
												}
											}
										]
									}
								},
								{
									type: "div",
									props: {
										style: { fontSize: "1.5rem" },
										children: author
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
					data: await loadGoogleFont(locale, [...new Set(`·#${contentType}${site}${author}${title}${time}${series}${tags}`)].join(""))
				}
			]
		}
	);

	return sharp(Buffer.from(svg)).resize(1200).png().toBuffer();
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

import satori from "satori";
import sharp from "sharp";
import icon from "$public/favicon.svg?raw";
import { loadFont } from ".";

/*
<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", background: "#fffffd" }}>
	<img src={`data:image/svg+xml;base64,${Buffer.from(icon).toString("base64")}`} alt="LOGO" width={120} height={120} />
	<span style={{ fontSize: "4rem", fontWeight: 900, color: "#1a1a1a", textAlign: "center" }}>{title}</span>
	<span style={{ fontSize: "1.75rem", color: "#888888", textAlign: "center", maxWidth: "75%" }}>{description}</span>
	<span style={{ marginTop: "3rem", borderBottom: "2px solid", padding: "0 0.5rem", fontSize: "1.5rem", color: "#666666" }}>{author}</span>
</div>
*/

export default async ({ locale, title, description, author }: { locale: string; title: string; description: string; author: string }) => {
	const svg = await satori(
		{
			type: "div",
			props: {
				style: {
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: "1.5rem",
					background: "#fffffd"
				},
				children: [
					{
						type: "img",
						props: {
							src: `data:image/svg+xml;base64,${Buffer.from(icon).toString("base64")}`,
							alt: "LOGO",
							width: 120,
							height: 120
						}
					},
					{
						type: "span",
						props: {
							style: {
								fontSize: "4rem",
								fontWeight: 900,
								color: "#1a1a1a",
								textAlign: "center"
							},
							children: title
						}
					},
					{
						type: "span",
						props: {
							style: {
								fontSize: "1.75rem",
								color: "#888888",
								textAlign: "center",
								maxWidth: "75%"
							},
							children: description
						}
					},
					{
						type: "span",
						props: {
							style: {
								marginTop: "3rem",
								borderBottom: "2px solid",
								padding: "0 0.5rem",
								fontSize: "1.5rem",
								color: "#666666"
							},
							children: author
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
					data: await loadFont(locale)
				}
			]
		}
	);

	return sharp(Buffer.from(svg)).resize(1200).png().toBuffer();
};

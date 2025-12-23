import { defineFontProvider, type FontFaceData } from "unifont";
import { parse, findAll, generate, type Atrule, type CssNode } from "css-tree";

const ORIGIN = "https://fontsapi.zeoseven.com";

const ZEOSEVEN_FONTS = {
	"Maple Mono NF CN": 442,
	"The Peak Font Plus": 556
};

export const provider = defineFontProvider("ZeoSeven Fonts", async () => ({
	resolveFont: async fontFamily => {
		const id = ZEOSEVEN_FONTS[fontFamily as keyof typeof ZEOSEVEN_FONTS];
		if (!id) return { fonts: [] };

		const cssURL = new URL(`/${id}/main/result.css`, ORIGIN);
		const style = await (await fetch(cssURL)).text();
		const css = parse(style);
		const fontFaces = findAll(css, node => node.type === "Atrule" && node.name === "font-face") as Atrule[];

		const fonts: FontFaceData[] = fontFaces
			.map(fontFace => {
				const font: FontFaceData = { src: [] };
				fontFace.block?.children.forEach(declaration => {
					if (declaration.type !== "Declaration") return;

					const property = declaration.property;

					let value: CssNode | null | undefined;
					if (declaration.value.type === "Value") {
						switch (property) {
							case "src": {
								const children = Array.from(declaration.value.children);
								children.forEach((node, index) => {
									if (node.type === "Function") {
										if (node.name === "local" && node.children.first?.type === "String")
											font.src.push({ name: node.children.first.value });
									} else if (node.type === "Url") {
										const next = children[index + 1];
										let format: string | undefined;
										if (next && next.type === "Function" && next.name === "format" && next.children.first?.type === "String") {
											format = next.children.first.value;
										}
										font.src.push({ url: new URL(node.value, cssURL).href, format });
									}
								});
								break;
							}

							case "font-style":
								value = declaration.value.children.first;
								if (value?.type === "Identifier") font.style = value.name;
								break;

							case "font-weight":
								value = declaration.value.children.first;
								if (value?.type === "Number") font.weight = value.value;
								break;

							case "unicode-range":
								font.unicodeRange = generate(declaration.value)
									.split(",")
									.map(range => range.trim());
								break;
						}
					}
				});

				return font;
			})
			.filter(font => font.src.length > 0);

		return { fonts };
	},
	listFonts: () => Object.keys(ZEOSEVEN_FONTS)
}));

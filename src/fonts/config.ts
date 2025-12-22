import { defineAstroFontProvider } from "astro/config";

export function ZeoSevenFonts() {
	return defineAstroFontProvider({
		entrypoint: "src/fonts/zeo_seven_fonts.ts"
	});
}

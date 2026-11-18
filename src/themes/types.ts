import type { ShikiConfig } from "@astrojs/markdown-remark";

export type ColorScheme = "light" | "dark";
export type ColorMode = ColorScheme | "system";

/** Semantic colors shared by every component. Values are CSS colors. */
export interface ThemeColors {
	primary: string;
	secondary: string;
	weak: string;
	background: string;
	block: string;
	shadow: string;
	selection: string;
	accent: string;
	link: string;
	heatmap: string;
	success: string;
	info: string;
	warning: string;
	danger: string;
	codeBackground: string;
}

export interface ThemeDefinition {
	name: string;
	colors: Record<ColorScheme, ThemeColors>;
	/** Font stacks; use installed fonts, system fonts, or CSS variables. */
	fonts: { body: string; mono: string; display: string };
	layout: { contentWidth: string; fontSize: string; mobileFontSize: string; lineHeight: number };
	code: { light: NonNullable<ShikiConfig["themes"]>[string]; dark: NonNullable<ShikiConfig["themes"]>[string] };
}

export interface ThemeOverrides {
	colors?: { light?: Partial<ThemeColors>; dark?: Partial<ThemeColors> };
	fonts?: Partial<ThemeDefinition["fonts"]>;
	layout?: Partial<ThemeDefinition["layout"]>;
	code?: Partial<ThemeDefinition["code"]>;
}

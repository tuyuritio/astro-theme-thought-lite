import thoughtLite from "./thought-lite";
import latte from "./catppuccin/latte";
import frappe from "./catppuccin/frappe";
import macchiato from "./catppuccin/macchiato";
import mocha from "./catppuccin/mocha";
import type { ThemeDefinition } from "./types";

/** Individually selectable official palettes, paired with their Shiki themes. */
export const catppuccinVariants = {
	"catppuccin-latte": { scheme: "light", colors: latte, code: "catppuccin-latte" },
	"catppuccin-frappe": { scheme: "dark", colors: frappe, code: "catppuccin-frappe" },
	"catppuccin-macchiato": { scheme: "dark", colors: macchiato, code: "catppuccin-macchiato" },
	"catppuccin-mocha": { scheme: "dark", colors: mocha, code: "catppuccin-mocha" }
} as const;

/** Default Catppuccin pairing; individual variants can also be selected per scheme. */
export default {
	...thoughtLite,
	name: "catppuccin",
	colors: { light: latte, dark: mocha },
	code: { light: "catppuccin-latte", dark: "catppuccin-mocha" }
} satisfies ThemeDefinition;

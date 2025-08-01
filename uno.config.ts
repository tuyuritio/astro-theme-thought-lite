import { defineConfig } from "unocss";
import VariantGroup from "@unocss/transformer-variant-group";
import Directives from "@unocss/transformer-directives";

export default defineConfig({
	transformers: [
		VariantGroup(),
		Directives(),
	],
	rules: [
		["invisible", { visibility: 'hidden' }]
	],
	shortcuts: [
		["form-button", "m-a border-rd py-1 px-2 c-background bg-secondary"],
		["pop", "opacity-0 invisible z-1 transition-[opacity,visibility] group-hover:(opacity-100 visible)"] // Needs to be used with parent owns (group & relative)
	],
	theme: {
		colors: {
			"primary": "var(--primary-color)",
			"secondary": "var(--secondary-color)",
			"remark": "var(--remark-color)",
			"weak": "var(--weak-color)",
			"background": "var(--background-color)",
			"block": "var(--block-color)",
			"shadow": "var(--shadow-color)",
			"selection": "var(--selection-color)",
		},
		fontFamily: {
			mono: ["Maple Mono NF CN", "monospace"],
			cursive: ["Playwrite MX", "serif"],
		}
	},
});

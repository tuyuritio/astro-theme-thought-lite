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
		["link", "underline decoration-transparent decoration-0.05em underline-offset-0.15em transition-text-decoration-color hover:decoration-current"],
		["input", "border-b-2 border-b-solid border-b-primary py-0.5 bg-transparent outline-none"],
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
			cursive: ["Playwrite MX", "The Peak Font Plus", "serif"],
		}
	},
});

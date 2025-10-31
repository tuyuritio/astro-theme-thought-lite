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
		},
		animation: {
			keyframes: {
				shaky: "{0%{transform:translate(0,0)rotate(0deg)}10%{transform:translate(-1px,-2px)rotate(-1deg)}20%{transform:translate(-3px,1px)rotate(1deg)}30%{transform:translate(2px,-1px)rotate(0deg)}40%{transform:translate(1px,2px)rotate(1deg)}50%{transform:translate(-1px,-1px)rotate(-1deg)}60%{transform:translate(-3px,1px)rotate(0deg)}70%{transform:translate(2px,1px)rotate(-1deg)}80%{transform:translate(-1px,-2px)rotate(1deg)}90%{transform:translate(2px,2px)rotate(0deg)}100%{transform:translate(0,0)rotate(-1deg)}}",
				"spin-slow": "{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
				"pulse-glow": "{0%,100%{opacity:0.6}50%{opacity:1}}",
			},
			durations: {
				shaky: "0.6s",
				"spin-slow": "8s",
				"pulse-glow": "3s",
			},
			counts: {
				shaky: "infinite",
				"spin-slow": "infinite",
				"pulse-glow": "infinite",
			}
		}
	}
});

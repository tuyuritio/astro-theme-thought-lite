import type { ThemeDefinition } from "./types";

/** The original ThoughtLite appearance, also used for omitted configuration. */
export default {
	name: "thought-lite",
	colors: {
		light: {
			primary: "#2a2a28",
			secondary: "#7e7e7b",
			weak: "#9f9f9c",
			background: "#fffffd",
			block: "#eeeeee",
			shadow: "#cdcdcc",
			selection: "#adadacc3",
			accent: "#2a2a28",
			link: "inherit",
			heatmap: "#2a2a28",
			success: "#48a131",
			info: "#3366cc",
			warning: "#bf8700",
			danger: "#ee3838",
			codeBackground: "#eeeeee"
		},
		dark: {
			primary: "#dddddb",
			secondary: "#9e9e9b",
			weak: "#5d5d5a",
			background: "#0e0e0c",
			block: "#1e1e1e",
			shadow: "#323231",
			selection: "#adadacc3",
			accent: "#dddddb",
			link: "inherit",
			heatmap: "#dddddb",
			success: "#48a131",
			info: "#3366cc",
			warning: "#bf8700",
			danger: "#ee3838",
			codeBackground: "#1e1e1e"
		}
	},
	fonts: {
		body: "var(--font-serif), var(--font-mono)",
		mono: "var(--font-maple-mono-nf-cn)",
		display: "var(--font-playwrite-mx), var(--font-the-peak-font-plus)"
	},
	layout: { contentWidth: "1000px", fontSize: "1.0625rem", mobileFontSize: "1rem", lineHeight: 1.75 },
	code: { light: "github-light", dark: "dark-plus" }
} satisfies ThemeDefinition;

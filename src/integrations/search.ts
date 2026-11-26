import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import YAML from "yaml";
import siteConfig, { monolocale } from "../../site.config";
import plain from "../lib/remark/plain";

const VIRTUAL = "virtual:search";
const COLLECTIONS = ["note", "jotting"] as const;
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

type Collection = (typeof COLLECTIONS)[number];

async function buildCorpus(rootDir: string, collection: Collection, locale: string): Promise<Record<string, string>> {
	const baseDir = path.join(rootDir, "src/content", collection);
	if (!fs.existsSync(baseDir)) return {};

	const corpus: Record<string, string> = {};
	for (const file of fs.globSync("**/*.md", { cwd: baseDir, exclude: ["**/_*", "**/_*/**"] })) {
		const id = file
			.split(path.sep)
			.join("/")
			.replace(/\.md$/i, "")
			.replace(/\/index$/i, "")
			.toLowerCase();
		if (!monolocale && id.split("/")[0] !== locale) continue;

		const raw = fs.readFileSync(path.join(baseDir, file), "utf-8");
		const match = raw.match(FRONTMATTER);
		const data = (match ? YAML.parse(match[1]) : {}) as Record<string, unknown> | null;
		if (data?.draft) continue;

		const body = match ? raw.slice(match[0].length) : raw;
		const parts = [
			typeof data?.description === "string" ? data.description.replace(/\s+/g, " ").trim() : "",
			!data?.sensitive && body ? String(await plain.process(body)) : ""
		].filter(Boolean);

		if (parts.length > 0) corpus[id] = parts.join(" ");
	}

	return corpus;
}

export default function searchIntegration(): AstroIntegration {
	const locales: readonly string[] = siteConfig.i18n.locales;
	let rootDir = process.cwd();

	function parseVirtualId(raw: string): { collection: Collection; locale?: string } | null {
		const clean = raw.split("?")[0];
		const prefix = clean.startsWith(`\0${VIRTUAL}/`) ? `\0${VIRTUAL}/` : clean.startsWith(`${VIRTUAL}/`) ? `${VIRTUAL}/` : null;
		if (!prefix) return null;

		const parts = clean.slice(prefix.length).split("/");
		if (parts.length > 2) return null;

		const [collection, locale] = parts as [Collection, string | undefined];
		if (!COLLECTIONS.includes(collection)) return null;
		if (locale !== undefined && !locales.includes(locale)) return null;

		return { collection, locale };
	}

	return {
		name: "thought-lite-search",
		hooks: {
			"astro:config:setup": ({ config, addWatchFile, updateConfig }) => {
				rootDir = fileURLToPath(config.root);
				addWatchFile(new URL("./site.config.ts", config.root));

				updateConfig({
					vite: {
						plugins: [
							{
								name: "thought-lite-search-virtual",
								resolveId(id) {
									if (parseVirtualId(id)) return `\0${id.split("?")[0]}`;
								},
								async load(id) {
									if (!id.startsWith(`\0${VIRTUAL}/`)) return;
									const parsed = parseVirtualId(id);
									if (!parsed) return;

									if (!parsed.locale) {
										const entries = locales.map(item => `\t"${item}": () => import("${VIRTUAL}/${parsed.collection}/${item}")`);
										return `export default {\n${entries.join(",\n")}\n};`;
									}

									return `export default ${JSON.stringify(await buildCorpus(rootDir, parsed.collection, parsed.locale))};`;
								},
								configureServer(server) {
									const contentRoot = path.join(rootDir, "src/content");
									server.watcher.on("all", (_event, changed) => {
										if (!changed.endsWith(".md") || !changed.startsWith(contentRoot)) return;
										for (const collection of COLLECTIONS) {
											for (const locale of locales) {
												const mod = server.moduleGraph.getModuleById(`\0${VIRTUAL}/${collection}/${locale}`);
												if (mod) server.moduleGraph.invalidateModule(mod);
											}
										}
									});
								}
							}
						]
					}
				});
			},
			"astro:config:done": ({ injectTypes }) => {
				const declarations = COLLECTIONS.map(
					collection =>
						`declare module "${VIRTUAL}/${collection}" {\n\tconst loaders: Record<string, () => Promise<{ default: Record<string, string> }>>;\n\texport default loaders;\n}`
				);
				injectTypes({
					filename: "search.d.ts",
					content: `${declarations.join("\n\n")}\n`
				});
			}
		}
	};
}

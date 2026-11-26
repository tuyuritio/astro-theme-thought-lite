import type { Attachment } from "svelte/attachments";

/** Split a search query into deduplicated lowercase terms */
export function tokenize(query: string): string[] {
	return Array.from(new Set(query.trim().toLowerCase().split(/\s+/).filter(Boolean)));
}

/** Build a longest-first case-insensitive regex matching any term */
export function buildPattern(terms: string[]): RegExp | null {
	if (terms.length === 0) return null;
	const escaped = [...terms].sort((a, b) => b.length - a.length).map(term => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
	return new RegExp(`(${escaped.join("|")})`, "gi");
}

/** Extract a short context window around the earliest matched term in body text */
export function excerpt(content: string | undefined, pattern: RegExp | null, radius = 56): string | null {
	if (!content || !pattern) return null;
	const hit = new RegExp(pattern.source, "i").exec(content);
	if (!hit) return null;

	const start = Math.max(0, hit.index - radius);
	const end = Math.min(content.length, hit.index + hit[0].length + radius);
	return `${start > 0 ? "…" : ""}${content.slice(start, end).trim()}${end < content.length ? "…" : ""}`;
}

/** Svelte 5 attachment applying CSS Custom Highlight API across title and excerpt text nodes */
export function highlight(pattern: RegExp | null, ..._deps: unknown[]): Attachment<HTMLElement> {
	return element => {
		if (typeof CSS === "undefined" || !("highlights" in CSS)) return;
		if (!pattern) {
			CSS.highlights.delete("search");
			return;
		}

		const ranges: Range[] = [];
		for (const target of element.querySelectorAll("section a, section p")) {
			const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
			let node: Node | null;
			while ((node = walker.nextNode())) {
				const text = node.textContent;
				if (!text) continue;

				pattern.lastIndex = 0;
				let match: RegExpExecArray | null;
				while ((match = pattern.exec(text))) {
					const range = new Range();
					range.setStart(node, match.index);
					range.setEnd(node, match.index + match[0].length);
					ranges.push(range);
				}
			}
		}

		if (ranges.length > 0) CSS.highlights.set("search", new Highlight(...ranges));
		else CSS.highlights.delete("search");

		return () => CSS.highlights.delete("search");
	};
}

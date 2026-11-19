/**
 * Validate a redirect target against the expected origin and return a safe relative path.
 * Falls back to `"/"` if the target is missing, malformed, or points to a different origin.
 * @param target - Candidate redirect URL or path (e.g., from `Referer` header)
 * @param origin - Allowed origin (e.g., `url.origin`)
 * @returns Same-origin relative path (`pathname + search + hash`) or `"/"`
 */
export function safeRedirect(target: string | null | undefined, origin: string): string {
	if (!target) return "/";

	try {
		const parsed = new URL(target, origin);
		if (parsed.origin !== origin) return "/";
		return `${parsed.pathname}${parsed.search}${parsed.hash}`;
	} catch {
		return "/";
	}
}

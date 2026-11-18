// Inlined in <head> so the selected palette is applied before first paint.
(() => {
	const root = document.documentElement;
	const mode = root.dataset.colorMode || "system";
	const media = window.matchMedia("(prefers-color-scheme: dark)");
	let saved;
	try {
		saved = localStorage.getItem("theme");
	} catch {
		// Storage may be unavailable; the current tab can still switch schemes.
	}

	const apply = () => {
		const preference = saved === "light" || saved === "dark" ? saved : mode;
		root.dataset.theme = preference === "system" ? (media.matches ? "dark" : "light") : preference;
	};
	apply();

	// Only follow the OS when the visitor has not selected an explicit scheme.
	media.addEventListener("change", apply);
	document.addEventListener("thought-lite:scheme", event => {
		saved = /** @type {CustomEvent} */ (event).detail;
		apply();
	});
	window.addEventListener("storage", event => {
		if (event.key === "theme" || event.key === null) {
			saved = event.newValue;
			apply();
		}
	});
})();

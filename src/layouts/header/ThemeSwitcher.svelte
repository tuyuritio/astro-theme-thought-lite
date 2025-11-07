<script lang="ts">
import { onMount } from "svelte";

let { sun, moon, dark = $bindable(false) } = $props();

/**
 * Apply theme to DOM and persist to localStorage
 * @param on whether to enable dark mode
 */
function turnDark(on: boolean) {
	let theme = (dark = on) ? "dark" : "light";
	// Update CSS custom properties via data attribute
	document.documentElement.dataset.theme = theme;
	// Persist user preference across sessions
	localStorage.setItem("theme", theme);
}

/**
 * Handle theme toggle with animated transition effect
 * @param event Mouse event for click coordinates
 */
function triggerDark(event: MouseEvent) {
	const trigger = () => turnDark(!dark);

	let transition: ViewTransition;
	if (!(transition = document.startViewTransition?.(trigger))) return trigger(); // Compatibility check

	// Get click coordinates for radial animation origin
	const x = event.clientX;
	const y = event.clientY;
	transition.ready.then(() => {
		// Create expanding circle animation from click point
		const path = [`circle(0% at ${x}px ${y}px)`, `circle(130% at ${x}px ${y}px)`];
		document.documentElement.animate(
			{
				// Reverse animation direction based on theme transition
				clipPath: dark ? [...path].reverse() : path
			},
			{
				duration: 400,
				easing: "ease-in",
				// Keep end state after animation completes to avoid flicker
				fill: "forwards",
				// Target different pseudo-elements for incoming/outgoing content
				pseudoElement: dark ? "::view-transition-old(root)" : "::view-transition-new(root)"
			}
		);
	});
}

onMount(() => {
	// Detect system color scheme preference
	const mode = window.matchMedia("(prefers-color-scheme: dark)");
	const theme = localStorage.getItem("theme");

	// Use stored preference or fallback to system preference
	turnDark(theme ? theme === "dark" : mode.matches);
	// Listen for system theme changes and apply automatically
	mode.addEventListener("change", ({ matches }) => turnDark(matches));
});
</script>

<button class="items-center" aria-label="Toggle dark theme" onclick={triggerDark}>
	{#if dark}
		{@render moon()}
	{:else}
		{@render sun()}
	{/if}
</button>

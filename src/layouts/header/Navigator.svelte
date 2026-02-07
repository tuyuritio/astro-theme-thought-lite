<script lang="ts">
import { onMount } from "svelte";
import Icon from "$components/Icon.svelte";

let { route, routes }: { route: string; routes: any[] } = $props();

/**
 * Check if a route is currently active based on the current route path
 * @param route - The current route path
 * @param home - The home route path
 * @param path - The navigation item path to check against
 * @param extra - Optional array of additional paths that should be considered active
 * @returns True if the route is active, false otherwise
 */
function active(path: string, extra?: string[]) {
	if (extra?.some(item => item === route)) return true;
	if (path === routes[0].path) return path === route;
	return route.startsWith(path);
}

/**
 * Handle closing the sidebar navigation
 */
function handleClose() {
	document.getElementById("sidebar")!.classList.remove("active");
	document.getElementById("sidebar-overlay")!.classList.remove("active");
}

onMount(() => {
	// Set up route tracking for page navigation with Swup integration
	const updateRoute = () => (route = window.location.pathname);
	if (window.swup) {
		// Register route update hook if Swup is already available
		window.swup.hooks.on("page:load", updateRoute);
	} else {
		// Wait for Swup to be enabled and then register the hook
		document.addEventListener("swup:enable", () => window.swup?.hooks.on("page:load", updateRoute));
	}
});
</script>

{#each routes as item}
	{@const isActive = active(item.path, item.extra)}
	<a href={item.path} onclick={handleClose} class="relative inline-flex items-center group" class:max-sm:font-bold={isActive}>
		<span class="sm:absolute sm:w-full h-full inline-flex items-center sm:justify-center sm:border-b-2 sm:py-1 transition-[border-color] duration-150 ease-linear" class:border-transparent={!isActive} class:border-secondary={isActive}><Icon name={item.icon} /></span>
		<p class="w-full sm:py-1 px-2.5 sm:text-center sm:text-background sm:bg-primary sm:clip-path-hidden transition-[clip-path] group-hover:clip-path-visible">{item.label}</p>
	</a>
{/each}

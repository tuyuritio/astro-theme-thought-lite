<script lang="ts">
import { getRelativeLocaleUrl } from "astro:i18n";
import { onMount } from "svelte";
import config, { monolocale } from "$config";
import Icon from "$components/Icon.svelte";
import i18nit from "$i18n";
import ThemeSwitcher from "./ThemeSwitcher.svelte";
import Menu from "./Menu.svelte";

let { locale, route }: { locale: string; route: string } = $props();

const t = i18nit(locale);

// Define home route and navigation routes configuration
const homeRoute = getRelativeLocaleUrl(locale);
const routes: { path: string; extra?: string[]; icon: `${string}--${string}`; label: string }[] = [
	{ label: t("navigation.home"), path: homeRoute, extra: [getRelativeLocaleUrl(locale, "/preface")], icon: "lucide--tent" },
	{ label: t("navigation.note"), path: getRelativeLocaleUrl(locale, "/note"), icon: "lucide--list" },
	{ label: t("navigation.jotting"), path: getRelativeLocaleUrl(locale, "/jotting"), icon: "lucide--feather" },
	{ label: t("navigation.about"), path: getRelativeLocaleUrl(locale, "/about"), icon: "lucide--at-sign" }
];

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
	if (path === homeRoute) return path === route;
	return route.startsWith(path);
}

// Control mobile menu visibility state
let menu: boolean = $state(false);
let navigator: HTMLElement | undefined = $state();

// Extract path without locale prefix for language switching
let path: string | undefined = $derived(route.slice(`/${locale === config.i18n.defaultLocale ? "" : locale}`.length) || undefined);

onMount(() => {
	// Close mobile menu when any navigation link is clicked
	for (const link of navigator!.getElementsByTagName("a")) {
		link.addEventListener("click", () => (menu = false));
	}

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

<button onclick={() => (menu = true)} class="sm:hidden"><Icon name="lucide--align-justify" /></button>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button onclick={() => (menu = false)} class:pointer-events-none={!menu} class:bg-transparent={!menu} class="fixed top-0 start-0 w-screen h-screen pointer-events-auto bg-[#aaaaaa88] transition-[background-color] sm:hidden"></button>

<nav bind:this={navigator} class:translate-x-full={!menu} class:rtl:-translate-x-full={!menu} class="fixed top-0 end-0 flex flex-col justify-between items-start gap-5 p-5 bg-background h-full sm:contents overflow-hidden transition-transform">
	<header class="grid gap-5 text-secondary grid-rows-[repeat(5,1fr)] sm:grid-rows-none sm:grid-cols-[repeat(4,1fr)]">
		<button onclick={() => (menu = false)} class="sm:hidden"><Icon name="lucide--x" /></button>

		{#each routes as item}
			{@const isActive = active(item.path, item.extra)}
			<a href={item.path} class="relative inline-flex items-center group" class:max-sm:font-bold={isActive}>
				<span class="sm:absolute sm:w-full h-full inline-flex items-center sm:justify-center sm:border-b-2 sm:py-1 transition-[border-color] duration-150 ease-linear" class:border-transparent={!isActive} class:border-secondary={isActive}><Icon name={item.icon} /></span>
				<p class="w-full sm:py-1 px-2.5 sm:text-center sm:text-background sm:bg-primary sm:clip-path-hidden transition-[clip-path] group-hover:clip-path-visible">{item.label}</p>
			</a>
		{/each}
	</header>

	<footer class="flex flex-col gap-2 sm:flex-row sm:gap-7">
		<ThemeSwitcher />

		<a href={getRelativeLocaleUrl(locale, "/feed.xml")} target="_blank" aria-label="Subscription" class="inline-flex"><Icon name="lucide--rss" /></a>

		{#if !monolocale}
			<Menu label="Language switcher">
				{#snippet trigger()}<Icon name="lucide--earth" />{/snippet}
				<div data-no-swup class="contents">
					{#each config.i18n.locales as locale}
						<a href={getRelativeLocaleUrl(locale as string, path)} lang={locale} aria-label={i18nit(locale)("language")}>{i18nit(locale)("language")}</a>
					{/each}
				</div>
			</Menu>
		{/if}
	</footer>
</nav>

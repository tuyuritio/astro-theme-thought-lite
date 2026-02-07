<script lang="ts">
import { getRelativeLocaleUrl } from "astro:i18n";
import { onMount } from "svelte";
import config from "$config";
import i18nit from "$i18n";

let { locale, route }: { locale: string; route: string } = $props();

let path: string | undefined = $derived(route.slice(`/${locale === config.i18n.defaultLocale ? "" : locale}`.length) || undefined);

onMount(() => {
	/** Register route update hook */
	const register = () => window.swup?.hooks.on("page:load", () => (route = window.location.pathname));

	// Register the hook immediately if swup is already enabled, otherwise wait for the enable event
	window.swup ? register() : document.addEventListener("swup:enable", register, { once: true });
});
</script>

{#each config.i18n.locales as target}
	<a data-no-swup href={getRelativeLocaleUrl(target, path)} lang={target} aria-current={locale === target ? "page" : undefined} class={locale === target ? "font-bold sm:bg-primary sm:text-background pointer-events-none" : ""}>{i18nit(target)("language")}</a>
{/each}

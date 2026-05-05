<script lang="ts">
import { onMount } from "svelte";
import { SvelteMap } from "svelte/reactivity";
import config from "$config";
import i18nit from "$i18n";

let { locale }: { locale: string } = $props();

type Locales = (typeof config.i18n.locales)[number];

const urls = new SvelteMap<Locales, string>();

function localedURLs() {
	let links = document.head.querySelectorAll<HTMLAnchorElement>('link[rel="alternate"][hreflang]');
	links.forEach(link => {
		let locale = link.getAttribute("hreflang") as Locales;
		urls.set(locale, link.href);
	});
}

onMount(() => {
	// Initialize the URLs map
	localedURLs();

	/** Register route update hook */
	const register = () => window.swup?.hooks.on("content:replace", localedURLs);

	// Register the hook immediately if swup is already enabled, otherwise wait for the enable event
	window.swup ? register() : document.addEventListener("swup:enable", register, { once: true });
});
</script>

{#each config.i18n.locales as target}
	<a data-no-swup href={urls.get(target)} lang={target} aria-current={locale === target ? "page" : undefined} class={locale === target ? "font-bold sm:bg-primary sm:text-background pointer-events-none" : ""}>{i18nit(target)("language")}</a>
{/each}

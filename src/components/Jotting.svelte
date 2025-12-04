<script lang="ts">
import { getRelativeLocaleUrl } from "astro:i18n";
import { onMount } from "svelte";
import { flip } from "svelte/animate";
import { fade } from "svelte/transition";
import { monolocale } from "$config";
import Icon from "$components/Icon.svelte";
import i18nit from "$i18n";

let { locale, jottings, tags: tagList }: { locale: string; jottings: any[]; tags: string[] } = $props();

const t = i18nit(locale);

let initial = $state(false); // Track initial load to prevent unexpected effects
let tags: string[] = $state([]);
let filtered: any[] = $derived.by(() => {
	let list: any[] = jottings
		// Apply tag filtering
		.filter(jotting => tags.every(tag => jotting.data.tags?.includes(tag)))
		// Sort by timestamp (newest first)
		.sort((a, b) => b.data.top - a.data.top || b.data.timestamp.getTime() - a.data.timestamp.getTime());

	if (!initial) return list;

	// Build URL with current page and tag filters
	let params = new URLSearchParams();

	params.set("page", String(page));
	for (const tag of tags) params.append("tag", tag);

	let url = `${location.pathname}?${params.toString()}`;

	// Match https://github.com/swup/swup/blob/main/src/helpers/history.ts#L22
	window.history.replaceState({ url, random: Math.random(), source: "swup" }, "", url);

	return list;
});

// Calculate pagination
const size: number = 20;
let pages: number = $derived(Math.ceil(filtered.length / size));

// Ensure page is within valid range
let page: number = $state(1);
$effect(() => {
	page = Math.max(1, Math.min(Math.floor(page), pages));
});

// Apply pagination by slicing the array
let list: any[] = $derived(filtered.slice((page - 1) * size, page * size));

/**
 * Toggle tag inclusion/exclusion in the filter list
 * @param tag Tag to toggle
 * @param turn whether to include or exclude the tag
 */
function switchTag(tag: string, turn?: boolean) {
	let included = tags.includes(tag);
	if (turn === undefined) turn = !included;

	// Add tag if turning on and not included, or remove if turning off
	tags = turn ? (included ? tags : [...tags, tag]) : tags.filter(item => item !== tag);
}

onMount(() => {
	const params = new URLSearchParams(window.location.search);

	page = Number(params.get("page")) || 1;
	tags = params.getAll("tag");

	initial = true;
});
</script>

<main class="flex flex-col-reverse sm:flex-row gap-10 grow">
	<article class="flex flex-col grow">
		<header class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5">
			{#each list as jotting (jotting.id)}
				<section animate:flip={{ duration: 150 }} class="flex flex-col justify-center border-b border-dashed border-b-weak pb-1">
					<span class="flex items-center gap-1">
						{#if jotting.data.top > 0}<Icon name="lucide--flag-triangle-right" class="rtl:-scale-x-100"/>{/if}
						{#if jotting.data.sensitive}<Icon name="lucide--siren" title={t("sensitive.icon")} />{/if}
						<a href={getRelativeLocaleUrl(locale, `/jotting/${monolocale ? jotting.id : jotting.id.split("/").slice(1).join("/")}`)} class="leading-normal text-primary font-semibold link truncate">{jotting.data.title}</a>
					</span>
					<span class="flex gap-1">
						{#each jotting.data.tags as tag}
							<button onclick={() => switchTag(tag, true)} class="text-[0.825rem] text-remark">#{tag}</button>
						{/each}
					</span>
				</section>
			{:else}
				<div class="col-span-2 pt-[10vh] text-center text-secondary font-bold text-xl">{t("jotting.empty")}</div>
			{/each}
		</header>

		{#if pages > 1}
			<footer class="sticky bottom-0 flex items-center justify-center gap-3 mt-auto pb-1 text-weak bg-background font-mono">
				<button onclick={() => (page = Math.max(1, page - 1))}><Icon name="lucide--arrow-left" class="rtl:-scale-x-100" /></button>
				<button class:location={1 == page} onclick={() => (page = 1)}>{1}</button>

				{#if pages > 7 && page > 4}<Icon name="lucide--ellipsis" />{/if}

				{#each Array.from({ length: Math.min(5, pages - 2) }, (_, i) => i + Math.max(2, Math.min(pages - 5, page - 2))) as P (P)}
					<button class:location={P == page} onclick={() => (page = P)} animate:flip={{ duration: 150 }} transition:fade={{ duration: 150 }}>{P}</button>
				{/each}

				{#if pages > 7 && page < pages - 3}<Icon name="lucide--ellipsis" />{/if}

				<button class:location={pages == page} onclick={() => (page = pages)}>{pages}</button>
				<button onclick={() => (page = Math.min(pages, page + 1))}><Icon name="lucide--arrow-right" class="rtl:-scale-x-100" /></button>
			</footer>
		{/if}
	</article>
	<aside class="sm:basis-[200px] flex flex-col gap-5">
		<section>
			<h4>{t("jotting.tag")}</h4>
			<p>
				{#each tagList as tag (tag)}
					<button class:selected={tags.includes(tag)} onclick={() => switchTag(tag)}>{tag}</button>
				{/each}
			</p>
		</section>
	</aside>
</main>

<style>
	article {
		footer {
			button {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30px;
				height: 30px;
				margin-top: 0.25rem 0rem 0.5rem;
				border-bottom: 2px solid;
				font-style: var(--font-monospace);
				font-size: 0.875rem;
				transition: color 0.15s ease-in-out;

				&:hover,
				&.location {
					color: var(--primary-color);
				}
			}
		}
	}

	aside {
		section {
			display: flex;
			flex-direction: column;
			gap: 5px;

			p {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				gap: 5px;

				button {
					border-bottom: 1px solid var(--primary-color);
					padding: 0rem 0.35rem;
					font-size: 0.9rem;
					transition:
						color 0.1s ease-in-out,
						background-color 0.1s ease-in-out;

					&.selected {
						color: var(--background-color);
						background-color: var(--primary-color);
					}

					@media (min-width: 640px) {
						&:hover {
							color: var(--background-color);
							background-color: var(--primary-color);
						}
					}
				}
			}
		}
	}
</style>

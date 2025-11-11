<script lang="ts">
import { getRelativeLocaleUrl } from "astro:i18n";
import { onMount, type Snippet } from "svelte";
import { flip } from "svelte/animate";
import { fade } from "svelte/transition";
import { monolocale } from "$config";
import Time from "$utils/time";
import i18nit from "$i18n";

let {
	locale,
	notes,
	series: seriesList,
	tags: tagList,
	top,
	sensitive,
	left,
	right,
	dots
}: {
	locale: string;
	notes: any[];
	series: string[];
	tags: string[];
} & { [key: string]: Snippet } = $props();

const t = i18nit(locale);

let initial = $state(false); // Track initial load to prevent unexpected effects
let series: string | null = $state(null);
let tags: string[] = $state([]);
let filtered: any[] = $derived.by(() => {
	let list: any[] = notes
		// Apply series and tag filtering
		.filter(note => {
			// Check if note matches the specified series
			let matchSeries = !series || note.data.series === series;

			// Check if note contains all specified tags
			let matchTags = tags.every(tag => note.data.tags?.includes(tag));

			return matchSeries && matchTags;
		})
		// Sort by timestamp (newest first)
		.sort((a, b) => b.data.top - a.data.top || b.data.timestamp.getTime() - a.data.timestamp.getTime());

	if (!initial) return list;

	// Build URL with current page, series, and tag filters using URLSearchParams
	let params = new URLSearchParams();

	params.set("page", String(page));
	if (series) params.set("series", series);
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

/**
 * Select or deselect a series filter (only one series can be active at a time)
 * @param seriesChoice the series to select or deselect
 * @param turn whether to include or exclude the series
 */
function chooseSeries(seriesChoice: string, turn?: boolean) {
	if (turn === undefined) turn = series !== seriesChoice;
	// Set series if turning on, or clear if turning off
	series = turn ? seriesChoice : null;
}

onMount(() => {
	const params = new URLSearchParams(window.location.search);

	page = Number(params.get("page")) || 1;
	series = params.get("series");
	tags = params.getAll("tag");

	initial = true;
});
</script>

<main class="flex flex-col-reverse sm:flex-row gap-10 grow">
	<article class="flex flex-col gap-4 grow">
		{#each list as note (note.id)}
			<section animate:flip={{ duration: 150 }} class="flex flex-col sm:flex-row">
				<div class="flex flex-col gap-1">
					<div class="flex gap-1 items-center">
						{#if note.data.top > 0}<span>{@render top()}</span>{/if}
						{#if note.data.sensitive}<span>{@render sensitive()}</span>{/if}
						{#if note.data.series}<button onclick={() => chooseSeries(note.data.series, true)}>{note.data.series}</button><b>|</b>{/if}
						<a href={getRelativeLocaleUrl(locale, `/note/${monolocale ? note.id : note.id.split("/").slice(1).join("/")}`)} class="link">{note.data.title}</a>
					</div>
					<time datetime={note.data.timestamp.toISOString()} class="font-mono text-2.6 c-remark">{Time(note.data.timestamp)}</time>
				</div>
				<span class="flex items-center gap-1 sm:ml-a c-remark">
					{#each note.data.tags as tag}
						<button onclick={() => switchTag(tag, true)} class="text-3.5 sm:text-sm">#{tag}</button>
					{/each}
				</span>
			</section>
		{:else}
			<div class="pt-10vh text-center c-secondary font-bold text-xl">{t("note.empty")}</div>
		{/each}

		{#if pages > 1}
			<footer class="sticky bottom-0 flex items-center justify-center gap-3 mt-a pb-1 c-weak bg-background font-mono">
				<button onclick={() => (page = Math.max(1, page - 1))}>{@render left()}</button>
				<button class:location={1 == page} onclick={() => (page = 1)}>{1}</button>

				{#if pages > 7 && page > 4}{@render dots()}{/if}

				{#each Array.from({ length: Math.min(5, pages - 2) }, (_, i) => i + Math.max(2, Math.min(pages - 5, page - 2))) as P (P)}
					<button class:location={P == page} onclick={() => (page = P)} animate:flip={{ duration: 150 }} transition:fade={{ duration: 150 }}>{P}</button>
				{/each}

				{#if pages > 7 && page < pages - 3}{@render dots()}{/if}

				<button class:location={pages == page} onclick={() => (page = pages)}>{pages}</button>
				<button onclick={() => (page = Math.min(pages, page + 1))}>{@render right()}</button>
			</footer>
		{/if}
	</article>

	<aside class="sm:flex-basis-200px flex flex-col gap-5">
		<section>
			<h3>{t("note.series")}</h3>
			<p>
				{#each seriesList as seriesItem (seriesItem)}
					<button class:selected={seriesItem == series} onclick={() => chooseSeries(seriesItem)}>{seriesItem}</button>
				{/each}
			</p>
		</section>

		<section>
			<h3>{t("note.tag")}</h3>
			<p>
				{#each tagList as tag (tag)}
					<button class:selected={tags.includes(tag)} onclick={() => switchTag(tag)}>{tag}</button>
				{/each}
			</p>
		</section>
	</aside>
</main>

<style lang="less">
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
					padding: 0rem 0.2rem;

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

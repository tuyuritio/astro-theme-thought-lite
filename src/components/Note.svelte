<script lang="ts">
import { getRelativeLocaleUrl } from "astro:i18n";
import { untrack } from "svelte";
import { flip } from "svelte/animate";
import config, { monolocale } from "$config";
import Time from "$utils/time";
import Icon from "$components/Icon.svelte";
import Pagination from "$components/Pagination.svelte";
import i18nit from "$i18n";

let { locale, notes, series: seriesList, tags: tagList }: { locale: string; notes: any[]; series: string[]; tags: string[] } = $props();

const t = i18nit(locale);

/** Track initial load to parse URL parameters */
let initial = $state(true);

/** Pagination size */
const size: number = config.pagination?.note || 15;

let pages: number = $state(1);
let page: number = $state(1);
let pageParam: boolean = $state(false);
let series: string | null = $state(null);
let tags: string[] = $state([]);

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

	// Reset page parameter
	pageParam = false;
	page = 1;
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

	// Reset page parameter
	pageParam = false;
	page = 1;
}

/** Filtered and paginated list of notes */
let list: any[] = $derived.by(() => {
	let filtered: any[] = notes
		.filter(note => {
			// Check if note matches the specified series
			let matchSeries = !series || note.data.series === series;

			// Check if note contains all specified tags
			let matchTags = tags.every(tag => note.data.tags?.includes(tag));

			return matchSeries && matchTags;
		})
		// Sort by timestamp (newest first)
		.sort((a, b) => b.data.top - a.data.top || b.data.timestamp.getTime() - a.data.timestamp.getTime());

	untrack(() => {
		// Ensure page is within valid range
		pages = Math.ceil(filtered.length / size);
		page = Math.max(1, Math.min(Math.floor(page), pages));
	});

	// Apply pagination by slicing the array
	filtered = filtered.slice((page - 1) * size, page * size);

	return filtered;
});

$effect(() => {
	if (initial) {
		// Parse URL parameters when component is first mounted
		const params = new URLSearchParams(window.location.search);

		if (params.get("page") !== null) {
			pageParam = true;
			const value = Number(params.get("page"));
			page = Number.isNaN(value) ? 1 : value;
		}

		series = params.get("series");
		tags = params.getAll("tag");

		initial = false;
	} else {
		// Build URL with current page, series, and tag filters using URLSearchParams
		const url = new URL(window.location.href);
		url.searchParams.delete("series");
		url.searchParams.delete("tag");
		url.searchParams.delete("page");

		if (series) url.searchParams.set("series", series);
		for (const tag of tags) url.searchParams.append("tag", tag);

		if (page > 1) pageParam = true;
		if (pageParam) url.searchParams.set("page", String(page));

		// Match https://github.com/swup/swup/blob/main/src/helpers/history.ts#L22
		window.history.replaceState({ url: url.toString(), random: Math.random(), source: "swup" }, "", url);
	}
});
</script>

<main class="flex flex-col-reverse sm:flex-row gap-10 grow">
	<article class="flex flex-col gap-4 grow">
		{#each list as note (note.id)}
			<section animate:flip={{ duration: 150 }} class="flex flex-col">
				<div class="flex max-sm:flex-col">
					<div class="leading-[1.55] *:inline *:align-middle">
						{#if note.data.top > 0}<Icon name="lucide--flag-triangle-right" class="rtl:-scale-x-100" />{/if}
						{#if note.data.sensitive}<Icon name="lucide--siren" title={t("sensitive.icon")} />{/if}
						{#if note.data.series}
							<button onclick={() => chooseSeries(note.data.series, true)}>{note.data.series}</button>
							<span aria-hidden="true">|</span>
						{/if}
						<a href={getRelativeLocaleUrl(locale, `/note/${monolocale ? note.id : note.id.split("/").slice(1).join("/")}`)} class="link">{note.data.title}</a>
					</div>
					<span class="inline-flex items-center sm:justify-end gap-1 flex-wrap content-start sm:ms-auto">
						{#each note.data.tags as tag}
							<button onclick={() => switchTag(tag, true)} class="text-[0.875rem] text-remark sm:text-sm">#{tag}</button>
						{/each}
					</span>
				</div>
				<time datetime={note.data.timestamp.toISOString()} class="font-mono text-[0.65rem] text-remark">{Time.toString(note.data.timestamp)}</time>
			</section>
		{:else}
			<div class="pt-[10vh] text-center text-secondary font-bold text-xl">{t("note.empty")}</div>
		{/each}

		<Pagination bind:pages bind:page />
	</article>

	<aside class="sm:basis-50 shrink-0 flex flex-col gap-5">
		<section>
			<h4>{t("note.series")}</h4>
			<p>
				{#each seriesList as seriesItem (seriesItem)}
					<button class:selected={seriesItem == series} onclick={() => chooseSeries(seriesItem)}>{seriesItem}</button>
				{/each}
			</p>
		</section>

		<section>
			<h4>{t("note.tag")}</h4>
			<p>
				{#each tagList as tag (tag)}
					<button class:selected={tags.includes(tag)} onclick={() => switchTag(tag)}>{tag}</button>
				{/each}
			</p>
		</section>
	</aside>
</main>

<style>
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

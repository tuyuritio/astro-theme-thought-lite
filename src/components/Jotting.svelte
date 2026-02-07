<script lang="ts">
import { untrack } from "svelte";
import { flip } from "svelte/animate";
import config from "$config";
import Icon from "$components/Icon.svelte";
import Pagination from "$components/Pagination.svelte";
import i18nit from "$i18n";

let { locale, jottings, tags: tagList }: { locale: string; jottings: any[]; tags: string[] } = $props();

const t = i18nit(locale);

/** Track initial load to parse URL parameters */
let initial = $state(true);

/** Pagination size */
const size: number = config.pagination?.jotting || 24;

let pages: number = $state(1);
let page: number = $state(1);
let pageParam: boolean = $state(false);
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

/** Filtered and paginated list of jottings */
let list: any[] = $derived.by(() => {
	let filtered: any[] = jottings
		// Check if jotting contains all specified tags
		.filter(jotting => tags.every(tag => jotting.data.tags?.includes(tag)))
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

		tags = params.getAll("tag");

		initial = false;
	} else {
		// Build URL with current page, series, and tag filters using URLSearchParams
		const url = new URL(window.location.href);
		url.searchParams.delete("tag");
		url.searchParams.delete("page");

		for (const tag of tags) url.searchParams.append("tag", tag);

		if (page > 1) pageParam = true;
		if (pageParam) url.searchParams.set("page", String(page));

		// Match https://github.com/swup/swup/blob/main/src/helpers/history.ts#L22
		window.history.replaceState({ url: url.toString(), random: Math.random(), source: "swup" }, "", url);
	}
});
</script>

<main class="flex flex-col-reverse sm:flex-row gap-10 grow">
	<article class="flex flex-col grow">
		<header class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5">
			{#each list as jotting (jotting.id)}
				<section animate:flip={{ duration: 150 }} class="flex flex-col justify-center border-b border-dashed border-b-weak pb-1">
					<span class="flex items-center gap-1">
						{#if jotting.data.top > 0}<Icon name="lucide--flag-triangle-right" class="rtl:-scale-x-100" />{/if}
						{#if jotting.data.sensitive}<Icon name="lucide--siren" title={t("sensitive.icon")} />{/if}
						<a href={jotting.url} class="leading-normal text-primary font-semibold link truncate">{jotting.data.title}</a>
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

		<Pagination bind:pages bind:page />
	</article>

	<aside class="sm:basis-50 shrink-0 flex flex-col gap-5">
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

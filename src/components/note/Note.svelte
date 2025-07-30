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

				font-style: var(--monospace);
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
				}
			}
		}
	}
</style>

<main class="flex flex-col-reverse sm:flex-row gap-10 grow">
	<article class="flex flex-col gap-4 grow mb-3">
		{#each list as note (note.id)}
			<section animate:flip={{ duration: 150 }} class="flex flex-col sm:flex-row">
				<div class="flex flex-col gap-1">
					<div class="flex gap-1 items-center">
						{#if note.data.top > 0}{@render top()}{/if}
						{#if note.data.series}<button onclick={() => choose_series(note.data.series, true)}>{note.data.series}</button><b>|</b>{/if}
						<a href={getRelativeLocaleUrl(locale, `/note/${note.id.split("/").slice(1).join("/")}`)} class="hover:underline">{note.data.title}</a>
					</div>
					<time title={Time.full(note.data.timestamp)} class="font-mono text-2.6 c-remark">{Time(note.data.timestamp)}</time>
				</div>
				<span class="flex items-center gap-1 sm:ml-a c-remark">
					{#each note.data.tags as tag}
						<button onclick={() => switch_tag(tag, true)} class="text-3.5 sm:text-sm">#{tag}</button>
					{/each}
				</span>
			</section>
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
				{#each series_list as series_item (series_item)}
					<button class:selected={series_item == series} onclick={() => choose_series(series_item)}>{series_item}</button>
				{/each}
			</p>
		</section>

		<section>
			<h3>{t("note.tag")}</h3>
			<p>
				{#each tag_list as tag (tag)}
					<button class:selected={tags.includes(tag)} onclick={() => switch_tag(tag)}>{tag}</button>
				{/each}
			</p>
		</section>
	</aside>
</main>

<script lang="ts">
	import { actions } from "astro:actions";
	import { getRelativeLocaleUrl } from "astro:i18n";
	import { untrack, type Snippet } from "svelte";
	import { flip } from "svelte/animate";
	import { fade } from "svelte/transition";
	import Time from "$utils/time";
	import i18nit from "$i18n";
	import { push_tip } from "$components/Tip.svelte";

	let { locale, notes, pages, page, size, series_list, tag_list, series, tags, top, left, right, dots }: { locale: string; notes: any[]; pages: number; page: number; size: number; series_list: string[]; tag_list: string[]; series?: string; tags: string[]; top: Snippet; left: Snippet; right: Snippet; dots: Snippet } = $props();

	const t = i18nit(locale);

	/**
	 * Toggle tag inclusion/exclusion in the filter list
	 * @param tag Tag to toggle
	 * @param turn whether to include or exclude the tag
	 */
	function switch_tag(tag: string, turn?: boolean) {
		let included = tags.includes(tag);
		if (turn === undefined) turn = !included;

		// Add tag if turning on and not included, or remove if turning off
		tags = turn ? (included ? tags : [...tags, tag]) : tags.filter(item => item !== tag);
	}

	/**
	 * Select or deselect a series filter (only one series can be active at a time)
	 * @param series_choice the series to select or deselect
	 * @param turn whether to include or exclude the series
	 */
	function choose_series(series_choice: string, turn?: boolean) {
		if (turn === undefined) turn = series !== series_choice;
		// Set series if turning on, or clear if turning off
		series = turn ? series_choice : undefined;
	}

	// Track initial load to prevent unnecessary API calls
	let initial = $state(true);
	let list: any[] = $state(notes);
	$effect(() => {
		// Build URL with current page, series, and tag filters
		let url = getRelativeLocaleUrl(locale, `/note?page=${page}${series ? `&series=${series}` : ""}${tags.map(tag => `&tag=${tag}`).join("")}`);

		// Match https://github.com/swup/swup/blob/main/src/helpers/history.ts#L22
		window.history.replaceState({ url, random: Math.random(), source: "swup" }, "", url);

		// Prevent initial load from fetching data
		if (untrack(() => initial)) {
			untrack(() => (initial = false));
			return;
		}

		// Fetch note list with current filters and pagination
		actions.note.list({ locale, size, page, series, tags }).then(({ data, error }) => {
			if (!error) {
				// Update local state with fetched data
				list = data.notes;
				pages = data.pages;
				page = data.page;
			} else {
				push_tip("error", t("note.fetch.failure"));
			}
		});
	});
</script>

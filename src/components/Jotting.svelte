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
	<article class="flex flex-col grow mb-3">
		<header class="grid grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5">
			{#each list as jotting (jotting.id)}
				<section animate:flip={{ duration: 150 }} class="flex flex-col justify-center gap-0.5 border-2 border-solid border-weak border-rd-2 py-2 px-3">
					<a href={getRelativeLocaleUrl(locale, `/jotting/${jotting.id.split("/").slice(1).join("/")}`)} class="c-primary font-bold hover:underline">{jotting.data.title}</a>
					<span class="flex gap-1">
						{#each jotting.data.tags as tag}
							<button onclick={() => switch_tag(tag, true)} class="text-3.3 c-remark">#{tag}</button>
						{/each}
					</span>
				</section>
			{/each}
		</header>

		{#if pages > 1}
			<footer>
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
			<h3>{t("jotting.tag")}</h3>
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
	import { push_tip } from "$components/Tip.svelte";
	import i18nit from "$i18n";

	let { locale, jottings, pages, page, size, tag_list, tags, left, right, dots }: { locale: string; jottings: any[]; pages: number; page: number; size: number; tag_list: string[]; tags: string[]; left: Snippet; right: Snippet; dots: Snippet } = $props();

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

	// Track initial load to prevent unnecessary API calls
	let initial = $state(true);
	let list: any[] = $state(jottings);
	$effect(() => {
		// Build URL with current page and tag filters
		let url = getRelativeLocaleUrl(locale, `/jotting?page=${page}${tags.map(tag => `&tag=${tag}`).join("")}`);

		// Match https://github.com/swup/swup/blob/main/src/helpers/history.ts#L22
		window.history.replaceState({ url, random: Math.random(), source: "swup" }, "", url);

		// Prevent initial load from fetching data
		if (untrack(() => initial)) {
			untrack(() => (initial = false));
			return;
		}

		// Fetch jotting list with current filters and pagination
		actions.jotting.list({ locale, size, page, tags }).then(({ data, error }) => {
			if (!error) {
				// Update local state with fetched data
				list = data.jottings;
				pages = data.pages;
				page = data.page;
			} else {
				push_tip("error", t("jotting.fetch.failure"));
			}
		});
	});
</script>

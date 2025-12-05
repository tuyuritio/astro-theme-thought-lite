<script lang="ts">
import { onMount } from "svelte";
import { fade } from "svelte/transition";
import Icon from "$components/Icon.svelte";
import i18nit from "$i18n";

let { locale, open = $bindable(false) }: { locale: string; open: boolean } = $props();

const t = i18nit(locale);

let pagefind: any = $state(null);
let query: string = $state("");
let results: any[] = $state([]);
let loading: boolean = $state(false);
let selected: number = $state(-1);
let container: HTMLElement | undefined = $state();

const focus = (node: HTMLElement) => node.focus();

const INPUT_SEARCH_DELAY = 300;
$effect(() => {
	if (!query) {
		results = [];
		selected = -1;
		loading = false;

		return;
	}

	loading = true;

	const timeout = setTimeout(async () => {
		if (!pagefind) return (loading = false);

		try {
			const response = await pagefind.search(query);
			results = await Promise.all(
				response.results.slice(0, 10).map(async (result: any) => {
					const data = await result.data();
					if (data.url.endsWith("/")) data.url = data.url.slice(0, -1);
					return data;
				})
			);
			selected = -1;
		} finally {
			loading = false;
		}
	}, INPUT_SEARCH_DELAY);

	return () => clearTimeout(timeout);
});

$effect(() => {
	if (!open) {
		query = "";
		results = [];
		selected = -1;
	}
});

function handleKeydown(event: KeyboardEvent) {
	if (event.key === "Escape") {
		open = false;
		return;
	}

	if (!results.length) return;

	switch (event.key) {
		case "ArrowDown":
			event.preventDefault();
			selected = (selected + 1) % results.length;
			break;

		case "ArrowUp":
			event.preventDefault();
			selected = (selected - 1 + results.length) % results.length;
			break;

		case "Enter":
			if (selected >= 0) {
				event.preventDefault();
				(container?.children[selected]?.querySelector("a") as HTMLAnchorElement)?.click();
			}
			return;

		default:
			return;
	}

	container?.children[selected]?.scrollIntoView({ block: "nearest" });
}

onMount(async () => {
	try {
		const uri = "/pagefind/pagefind.js";
		pagefind = await import(uri);
		await pagefind.options({ excerptLength: 20 });
	} catch {
		console.warn("PageFind not available - run build first to generate search index");
	}
});
</script>

{#if open}
	<div role="dialog" tabindex="-1" onmousedown={event => (event.target === event.currentTarget ? (open = false) : null)} onkeydown={event => (event.key === "Escape" ? (open = false) : null)} transition:fade={{ duration: 150 }} class="fixed inset-0 z-4 flex items-start justify-center w-screen h-screen bg-transparent backdrop-blur-md outline-none">
		<div class="w-[min(calc(100%-50px),800px)] mx-4 mt-[5vh] overflow-hidden">
			<div class="flex items-center gap-3 mb-4 border-b border-dashed pb-2">
				<Icon name="lucide--search" />

				<input type="text" use:focus onkeydown={handleKeydown} bind:value={query} placeholder={t("search.placeholder")} class="grow outline-none placeholder:text-weak" />

				{#if loading}
					<Icon name="lucide--loader-2" class="text-secondary animate-spin shrink-0" />
				{:else if query}
					<button onclick={() => (query = "")}><Icon name="lucide--x" /></button>
				{/if}
			</div>

			{#if query && !loading}
				<ul bind:this={container} class="flex flex-col gap-5 max-h-[80vh] overflow-y-auto">
					{#each results as result, index}
						<li transition:fade={{ duration: 100 }} class="me-5 border-b border-b-weak pb-2">
							<a href={result.url} onclick={() => (open = false)} class="flex flex-col gap-1 border-s-4 hover:border-secondary {index === selected ? 'border-secondary' : 'border-transparent'} ps-3 transition-[border]">
								<h4>{result.meta?.title}</h4>
								<p class="search-excerpt text-sm text-secondary">{@html result.excerpt}</p>
							</a>
						</li>
					{:else}
						<li transition:fade={{ duration: 100 }} class="text-center text-weak">{t("search.empty")}</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
{/if}

<style>
	.search-excerpt :global(mark) {
		background-color: var(--selection-color);
	}
</style>

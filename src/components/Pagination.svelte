<script lang="ts">
import { flip } from "svelte/animate";
import { fade } from "svelte/transition";
import Icon from "./Icon.svelte";

let { pages = $bindable(), page = $bindable() }: { pages: number; page: number } = $props();
</script>

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

<style>
footer {
	button {
		display: flex;
		align-items: center;
		justify-content: center;

		width: 30px;
		height: 30px;

		margin-top: 0.25rem 0rem 0.5rem;
		border-bottom: 2px solid;

		font-style: var(--font-mono);
		font-size: 0.875rem;

		transition: color 0.15s ease-in-out;

		&:hover,
		&.location {
			color: var(--primary-color);
		}
	}
}
</style>

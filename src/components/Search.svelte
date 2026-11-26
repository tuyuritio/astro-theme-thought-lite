<script lang="ts">
import Icon from "$components/Icon.svelte";
import { onDestroy, untrack } from "svelte";

interface Props {
	query?: string;
	onchange?: (query: string) => void;
}

let { query = $bindable(""), onchange }: Props = $props();

// Handle composition events for input method editors (IME)
let composing: boolean = false;

let value: string = $state("");
let timer: ReturnType<typeof setTimeout> | undefined;

function commit(next: string) {
	if (query === next) return;
	query = next;
	onchange?.(next);
}

$effect(() => {
	const external = query;
	untrack(() => {
		if (!composing && external !== value) value = external;
	});
});

onDestroy(() => clearTimeout(timer));
</script>

<search class="flex items-center gap-1 border-b py-0.5 text-weak focus-within:text-primary transition-colors">
	<span aria-hidden="true"><Icon name="lucide--search" size={12} /></span>

	<input
		type="search"
		aria-label="Search"
		bind:value
		oninput={() => {
			if (composing) return;

			clearTimeout(timer);
			timer = setTimeout(() => commit(value), 250);
		}}
		oncompositionstart={() => (composing = true)}
		oncompositionend={() => {
			composing = false;
			clearTimeout(timer);
			commit(value);
		}}
		class="text-inherit w-full text-sm"
	>

	{#if value}
		<button
			type="button"
			aria-label="Clear search"
			onclick={() => {
				clearTimeout(timer);
				value = "";
				commit("");
			}}
		>
			<Icon name="lucide--x" size={14} />
		</button>
	{/if}
</search>

<style>
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration {
	display: none;
}
</style>

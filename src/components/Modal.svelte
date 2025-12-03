<script lang="ts">
import { fade } from "svelte/transition";

let dialog: HTMLDialogElement | null = $state(null);

interface Props {
	open: any; // Controls modal visibility (bindable)
	children?: import("svelte").Snippet; // Optional content to render inside modal
}

let { open = $bindable(), children }: Props = $props();

// Reactive effect to show modal when open becomes true
$effect(() => {
	if (open) dialog?.showModal(); // Call native showModal() API when opened
});
</script>

{#if open}
	<dialog bind:this={dialog} onmousedown={event => (event.target == dialog ? (open = false) : null)} transition:fade={{ duration: 150 }} class="fixed m-auto border-2 border-weak rounded-md text-primary bg-background backdrop:bg-transparent shadow-md overflow-visible">
		<div class="p-5">{@render children?.()}</div>
	</dialog>
{/if}

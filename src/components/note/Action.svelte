<style lang="less">
	figure {
		button {
			position: relative;
			border-width: 2px;
			border-style: solid;

			border-radius: 50%;
			padding: 5px;

			background-color: var(--background-color);

			--uno: shadow-md;
		}
	}
</style>

<figure class="fixed right-[calc(20px+max(calc((100%-800px)/2),0px))] bottom-5 sm:bottom-7 flex flex-col gap-2">
	<button onclick={() => (document.scrollingElement!.scrollTop = 0)} class="border-weak">
		{@render top()}
		<svg class="absolute top--2px left--2px w-[calc(100%+4px)] h-[calc(100%+4px)] transform-origin-center pointer-events-none">
			<circle cx="50%" cy="50%" r="calc(50% - 1px)" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="calc(100% * 3)" stroke-dashoffset="calc(100% * 3 * {1 - progress})"></circle>
		</svg>
	</button>
	<button onclick={() => document.querySelector("#comment-section")?.scrollIntoView()}>
		{@render comment()}
	</button>
</figure>

<svelte:window onscroll={() => (progress = Math.min(1, window.scrollY / document.querySelector("#markdown-content")!.clientHeight))} />

<script lang="ts">
	import type { Snippet } from "svelte";

	let { top, comment }: { top: Snippet; comment: Snippet } = $props();

	let progress: number = $state(0);
</script>

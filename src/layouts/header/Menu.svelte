<div class="flex flex-col justify-center border-r-1 border-r-solid pr-2 border-primary sm:(relative border-0 p-0) group">
	<button class="items-center sm:(border-none)" aria-label={label}>{@render trigger()}</button>
	<div class="pt-1 z-1 bg-background sm:(absolute top-full left-1/2 h-max transform-translate-x--1/2 opacity-0 invisible transition-[opacity,visibility]) sm:group-hover:(opacity-100 visible)">
		<div class="flex flex-col sm:(border-2 border-solid border-primary shadow-md)">
			{@render children()}
		</div>
	</div>
</div>

<script lang="ts">
	import { type Snippet } from "svelte";

	let { label, trigger, children }: { label?: string; trigger: Snippet; children: Snippet } = $props();
</script>

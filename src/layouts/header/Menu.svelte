<script lang="ts">
import { type Snippet } from "svelte";

let { label, trigger, children }: { label?: string; trigger: Snippet; children: Snippet } = $props();
</script>

<div class="flex flex-col justify-center border-r border-r-solid pr-2 border-primary sm:relative sm:border-0 sm:p-0 group">
	<button class="items-center sm:border-none" aria-label={label}>{@render trigger()}</button>
	<div class="pt-1 z-1 bg-background sm:absolute sm:top-full sm:left-1/2 sm:h-max sm:-translate-x-1/2 sm:opacity-0 sm:invisible sm:transition-[opacity,visibility] sm:group-hover:opacity-100 sm:group-hover:visible">
		<div class="flex flex-col sm:border-2 sm:border-solid sm:border-primary sm:shadow-md">
			{@render children()}
		</div>
	</div>
</div>

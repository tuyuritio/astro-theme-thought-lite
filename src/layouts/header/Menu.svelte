<script lang="ts">
import { type Snippet } from "svelte";

let { label, trigger, children }: { label?: string; trigger: Snippet; children: Snippet } = $props();
</script>

<div class="flex flex-col justify-center border-e pe-2 border-primary sm:relative sm:border-0 sm:p-0 group">
	<button class="items-center sm:border-none" aria-label={label}>{@render trigger()}</button>
	<div class="pt-1 z-1 bg-background sm:absolute sm:top-full sm:start-1/2 sm:h-max sm:-translate-x-1/2 sm:rtl:translate-x-1/2 sm:opacity-0 sm:invisible sm:transition-[opacity,visibility] sm:group-hover:opacity-100 sm:group-hover:visible">
		<div class="menu flex flex-col sm:border-2 sm:border-primary sm:shadow-md">
			{@render children()}
		</div>
	</div>
</div>

<style>
	.menu :global(a) {
		font-size: 0.875rem;
		line-height: 1.15rem;
		white-space: nowrap;

		padding: 0.125rem 0;

		@media (min-width: 640px) {
			& {
				padding: 0.5rem 0.75rem;

				font-weight: bold;

				transition:
					color 150ms ease-in-out,
					background-color 150ms ease-out;

				&:hover {
					color: var(--background-color);
					background-color: var(--primary-color);
				}
			}
		}
	}
</style>

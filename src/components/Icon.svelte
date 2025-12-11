<script lang="ts">
interface Props {
	/** Icon name/identifier (required) - corresponds to icon file or icon set key */
	name: `${string}--${string}`;

	/** Icon size in pixels or CSS units (optional) - controls width/height */
	size?: number | string;

	/** Tooltip text to display on hover (optional) - enhances accessibility */
	title?: string;

	/** Additional CSS classes for custom styling (optional) */
	class?: string;
}

let { name, size, title, class: className }: Props = $props();

let value = size !== undefined ? (typeof size === "number" ? `${size}px` : size) : undefined;
let dimensions = value ? `width: ${value}; height: ${value}` : "";
</script>

<figure aria-label={title} class="relative inline-flex items-center leading-none group/icon">
	<span class="iconify {name} {className}" style={dimensions} aria-hidden="true"></span>

	{#if title}
		<span class="absolute bottom-full start-1/2 w-max h-max mb-1 py-1 px-1.5 rounded-sm text-background bg-primary text-xs font-serif font-normal leading-tight whitespace-pre-line z-2 opacity-0 invisible -translate-x-1/2 rtl:translate-x-1/2 translate-y-1 pointer-events-none group-hover/icon:opacity-100 group-hover/icon:visible group-hover/icon:translate-y-0 transition-[opacity,visibility,translate] duration-150">
			{title}
		</span>
	{/if}
</figure>

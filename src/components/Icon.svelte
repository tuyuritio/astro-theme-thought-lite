<script lang="ts">
interface Props {
	/** Icon name/identifier (required) - corresponds to icon file or icon set key */
	name: `${string}--${string}`;

	/** Icon size in pixels or CSS units (optional) - controls width/height */
	size?: number | string;

	/** Tooltip text to display on hover (optional) - enhances accessibility */
	title?: string;
}

let { name, size, title }: Props = $props();

let value = size !== undefined ? (typeof size === "number" ? `${size}px` : size) : undefined;
let dimensions = value ? `width: ${value}; height: ${value}` : "";
</script>

<figure aria-label={title} class="relative inline-flex items-center leading-none group">
	<span class="iconify {name}" style={dimensions} aria-hidden="true"></span>

	{#if title}
		<span class="absolute bottom-full left-1/2 w-max h-max mb-1 py-1 px-1.5 rounded-sm text-background bg-primary text-xs font-serif font-normal leading-tight whitespace-pre-line z-2 opacity-0 invisible -translate-x-1/2 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-[opacity,visibility,translate] duration-150">
			{title}
		</span>
	{/if}
</figure>

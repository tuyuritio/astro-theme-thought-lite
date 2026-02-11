<script lang="ts">
/*
 * This component is written in Svelte to ensure compatibility across both Svelte and Astro
 *
 * Using native [Anchor Position API](https://developer.chrome.com/docs/css-ui/anchor-positioning-api) for Tooltip implementation
 */

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

<figure aria-label={title} class="inline-flex items-center leading-none group/icon">
	<i class="iconify {name} {className}" style={dimensions} aria-hidden="true"></i>

	{#if title}
		<span class="mb-1 py-1 px-1.5 rounded-sm text-background bg-primary text-xs font-serif font-normal leading-tight whitespace-pre-line z-10 opacity-0 invisible translate-y-1 pointer-events-none group-hover/icon:opacity-100 group-hover/icon:visible group-hover/icon:translate-y-0 transition-[opacity,visibility,translate]">{title}</span>
	{/if}
</figure>

<style>
@supports (anchor-name: --anchor-icon) {
	figure {
		anchor-scope: --anchor-icon;

		i {
			anchor-name: --anchor-icon;
		}

		span {
			position: fixed;
			position-anchor: --anchor-icon;
			position-area: top;
			justify-self: anchor-center;
		}
	}
}

@supports not (anchor-name: --anchor-icon) {
	figure {
		position: relative;

		span {
			position: absolute;
			bottom: 100%;
			inset-inline-start: 50%;
			width: max-content;
			transform: translateX(-50%);
		}
	}

	figure span:dir(rtl) {
		transform: translateX(50%);
	}
}
</style>

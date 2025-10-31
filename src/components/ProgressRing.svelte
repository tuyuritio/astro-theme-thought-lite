<style lang="less">
  .ring-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .bg-ring {
      fill: none;
      stroke: var(--weak-color);
      opacity: 0.2;
    }

    .progress-ring {
      fill: none;
      stroke: var(--primary-color);
      transition: stroke-dashoffset 0.5s ease;
    }

    .center-content {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      transition: filter 0.3s ease;
    }
  }
</style>

<div class="ring-container" data-status={status} data-theme={theme} style="width: {size}px; height: {size}px;">
  <svg width={size} height={size} viewBox="0 0 {size} {size}" style="overflow: visible;">
    <!-- Background ring -->
    <circle class="bg-ring" cx={size / 2} cy={size / 2} r={radius} stroke-width={strokeWidth} />

    <!-- Ripple circles (only visible for in_progress status) -->
    {#if status === 'in_progress'}
      <circle
        class="ripple-circle"
        cx={size / 2}
        cy={size / 2}
        r={rippleRadius}
        stroke-width={strokeWidth * 0.3}
      />
      <circle
        class="ripple-circle"
        cx={size / 2}
        cy={size / 2}
        r={rippleRadius}
        stroke-width={strokeWidth * 0.3}
      />
      <circle
        class="ripple-circle"
        cx={size / 2}
        cy={size / 2}
        r={rippleRadius}
        stroke-width={strokeWidth * 0.3}
      />
    {/if}

    <!-- Progress ring -->
    <circle
      class="progress-ring status-{status}"
      cx={size / 2}
      cy={size / 2}
      r={radius}
      stroke-width={strokeWidth}
      stroke-dasharray={circumference}
      stroke-dashoffset={offset}
      stroke-linecap="round"
    />
  </svg>

  <div class="center-content status-{status}">
    {@render children?.()}
  </div>
</div>

<script lang="ts">
  /**
   * ProgressRing component
   * Displays a circular progress indicator with themeable visual states
   *
   * Available themes:
   * - plain: Plain progress ring with single static color, no animations
   * - minimal: Animated states with breathing, ripple, and color cycling effects
   */

  import type { Snippet } from 'svelte';

  let {
    status = 'todo',
    progress = 0,
    size = 120,
    strokeWidth = 4,
    theme = 'plain',
    children
  }: {
    status?: 'todo' | 'in_progress' | 'done';
    progress?: number;
    size?: number;
    strokeWidth?: number;
    theme?: string;
    children?: Snippet;
  } = $props();

  // Calculate SVG circle parameters
  const radius = $derived((size - strokeWidth) / 2);
  const circumference = $derived(2 * Math.PI * radius);

  // Ripple starts at outer edge of the main ring (radius + half stroke width)
  const rippleRadius = $derived(radius + strokeWidth / 2);

  // Calculate stroke-dashoffset based on progress (0-100)
  // Higher progress means less offset (more visible circle)
  const offset = $derived(circumference - (progress / 100) * circumference);
</script>

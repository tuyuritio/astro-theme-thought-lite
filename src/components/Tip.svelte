<script lang="ts" module>
import { writable } from "svelte/store";

type Tip = { type: string; content: string };

// Global reactive store containing array of active tips
// This store is shared across all instances of the Tip component
const tips = writable<Tip[]>([]);

/**
 * Remove a specific tip from the active tips list
 * @param tip - The tip object to remove
 */
const Close = (tip: Tip) => tips.update(list => list.filter(item => (item !== tip ? item : undefined)));

/**
 * Public API function to display a new tip/notification
 * This function can be imported and called from other components
 * @param type - Type of notification (determines icon and styling)
 * @param content - Text content to display in the notification
 */
export function pushTip(type: "information" | "success" | "question" | "warning" | "error", content: string): void {
	const tip = { type, content };

	// Add tip to the reactive store (triggers UI update)
	tips.update(list => [...list, tip]);

	// Auto-remove tip after 2.5 seconds for better UX
	setTimeout(() => Close(tip), 2500);
}
</script>

<script lang="ts">
	import { flip } from "svelte/animate";
	import { fly } from "svelte/transition";
	import { circInOut } from "svelte/easing";

	// Props: Icons object passed from parent containing icon renderers
	let icons = $props();
</script>

<figure class="fixed top-0 left-0 w-full h-full flex flex-col pr-5 z-3 pointer-events-none overflow-hidden">
	{#each $tips as tip (tip)}
		<section animate:flip={{ duration: 200, easing: circInOut }} transition:fly={{ y: -100, opacity: 0, duration: 200, easing: circInOut }} class="relative flex items-center gap-2 ml-a mt-7 b-2 b-solid b-weak rd-1 py-4 px-3 w-xs bg-background shadow-md pointer-events-initial">
			<span class="inline-flex">{@render icons[tip.type]()}</span>
			<p>{tip.content}</p>
			<span class="ml-a"><button onclick={() => Close(tip)}>{@render icons.x()}</button></span>
		</section>
	{/each}
</figure>

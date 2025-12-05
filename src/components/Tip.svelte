<script lang="ts" module>
import { writable } from "svelte/store";
import Icon from "$components/Icon.svelte";

/** Mapping of tip types to corresponding icon identifiers */
const icons = {
	information: "lucide--info",
	success: "lucide--check-circle",
	question: "lucide--help-circle",
	warning: "lucide--alert-triangle",
	error: "lucide--x-circle"
} as const;

/** Type definition for a tip/notification object */
type Tip = { type: keyof typeof icons; content: string };

/** Global reactive store containing array of active tips */
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
export function pushTip(type: keyof typeof icons, content: string): void {
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
</script>

<figure class="fixed top-0 start-0 w-full h-full flex flex-col pe-5 z-5 pointer-events-none overflow-hidden">
	{#each $tips as tip (tip)}
		<section animate:flip={{ duration: 200, easing: circInOut }} transition:fly={{ y: -100, opacity: 0, duration: 200, easing: circInOut }} class="relative flex items-center gap-2 ms-auto mt-7 border-2 border-weak rounded-sm py-4 px-3 w-xs bg-background shadow-md pointer-events-auto">
			<Icon name={icons[tip.type]} />
			<p>{tip.content}</p>
			<span class="ms-auto"><button onclick={() => Close(tip)}><Icon name="lucide--x" /></button></span>
		</section>
	{/each}
</figure>

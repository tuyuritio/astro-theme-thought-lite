<script lang="ts">
import { getRelativeLocaleUrl } from "astro:i18n";
import { monolocale } from "$config";
import Time from "$utils/time";
import i18nit from "$i18n";

let { locale, notes, jottings, weeks = 20 }: { locale: string; notes: any[]; jottings: any[]; weeks: number } = $props();

const days = weeks * 7; // Convert weeks to days for heatmap

// Initialize translation function for current locale
const t = i18nit(locale);

// Get this week's Saturday as reference point for calculating relative dates
const now = new Date();
// Get day of week in the configured timezone (0 = Sunday, 6 = Saturday)
const start = Time.addDays(now, (6 - Time.weekday(now)) % 7);

// Create 140-day heatmap data structure (roughly 4+ months of activity)
// Each day contains: date, empty arrays for notes and jottings
const heatmap = Array.from({ length: days }, (_, day) => ({
	date: Time.subtractDays(start, day), // Calculate date going backwards from today
	notes: [] as any[], // Notes published on this day
	jottings: [] as any[] // Jottings published on this day
}));

// Populate heatmap with notes data
notes.forEach(note => {
	// Calculate how many days ago this note was published
	let gap = Time.diffDays(start, note.data.timestamp);

	// Only include notes from the last 100 days
	if (0 <= gap && gap < days) heatmap[gap].notes.push(note);
});

// Populate heatmap with jottings data
jottings.forEach(jotting => {
	// Calculate how many days ago this jotting was published
	let gap = Time.diffDays(start, jotting.data.timestamp);

	// Only include jottings from the last 100 days
	if (0 <= gap && gap < days) heatmap[gap].jottings.push(jotting);
});
</script>

<section class="grid grid-flow-col grid-rows-7 gap-1">
	{#each heatmap.reverse() as day}
		{@const number = day.notes.length + day.jottings.length}
		<figure class="relative group">
			<i class="block w-2.5 h-2.5 bg-primary {number > 2 ? 'opacity-100' : number > 1 ? 'opacity-70' : number > 0 ? 'opacity-40' : 'opacity-10'}"></i>

			<div class="absolute left-0 bottom-full w-max -translate-x-1/2 flex flex-col mb-1 rd-1 px-2 py-2 text-size-xs c-background bg-primary pop">
				<time class="font-bold">{Time.date.locale(day.date, locale)}</time>
				{#if number > 0}
					{#if day.notes.length > 0}
						<p class="my-1">{t("home.heatmap.note", { count: day.notes.length })}：</p>
						<ul class="flex flex-col gap-0.5">
							{#each day.notes as note}
								<a href={getRelativeLocaleUrl(locale, `/note/${monolocale ? note.id : note.id.split("/").slice(1).join("/")}`)} aria-label={note.data.title} class="ml-1 link">{note.data.title}</a>
							{/each}
						</ul>
					{/if}
					{#if day.jottings.length > 0}
						<p class="my-1">{t("home.heatmap.jotting", { count: day.jottings.length })}：</p>
						<ul class="flex flex-col gap-0.5">
							{#each day.jottings as jotting}
								<a href={getRelativeLocaleUrl(locale, `/jotting/${monolocale ? jotting.id : jotting.id.split("/").slice(1).join("/")}`)} aria-label={jotting.data.title} class="ml-1 link">{jotting.data.title}</a>
							{/each}
						</ul>
					{/if}
				{:else}
					<p class="mt-1">{t("home.heatmap.empty")}</p>
				{/if}
			</div>
		</figure>
	{/each}
</section>

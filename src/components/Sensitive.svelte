<script lang="ts">
import type { Snippet } from "svelte";
import { fade } from "svelte/transition";
import i18nit from "$i18n";

let { locale, sensitive = false, back, children }: { locale: string; sensitive: boolean; back: string; children: Snippet } = $props();

const t = i18nit(locale);

let acknowledged = $state(false);
const locked = $derived(sensitive && !acknowledged);

$effect(() => {
	if (sensitive && acknowledged) {
		window.zoom?.();
		document.dispatchEvent(new CustomEvent("sensitive:reveal"));
	}
});
</script>

{#if locked}
	<div transition:fade={{ duration: 150 }} class="flex flex-col items-center justify-end gap-6">
		<h2>{t("sensitive.title")}</h2>
		<div class="flex flex-col items-center justify-end gap-3">
			<p>{t("sensitive.description")}</p>
			<p>{t("sensitive.warning")}</p>
		</div>
		<div class="flex gap-3">
			<button type="button" class="font-bold text-background bg-red-500 py-1 px-2 rounded-md" onclick={() => (acknowledged = true)}>
				{t("sensitive.continue")}
			</button>
			<a href={back} class="flex items-center font-bold text-background bg-secondary py-1 px-2 rounded-md">
				{t("sensitive.back")}
			</a>
		</div>
	</div>
{:else}
	<div transition:fade={{ delay: 150, duration: 150 }}>{@render children()}</div>
{/if}

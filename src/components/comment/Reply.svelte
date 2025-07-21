<main transition:slide={{ duration: 150 }} class="relative mt-5">
	{#if !drifter}
		<div id="forbid" class="absolute flex flex-col items-center justify-center gap-1 w-full h-full font-bold cursor-not-allowed [&>a]:(flex items-center justify-center gap-2 w-200px border-2 border-solid border-primary p-1 rounded-1)">
			{#if OAuth.GitHub}<a href="/drifter/roam/anchor/GitHub">{@render icon.GitHub()}<span>{t("oauth.github")}</span></a>{/if}
			{#if OAuth.Google}<a href="/drifter/roam/anchor/Google">{@render icon.Google()}<span>{t("oauth.google")}</span></a>{/if}
			{#if OAuth.X}<a href="/drifter/roam/anchor/X">{@render icon.X()}<span>{t("oauth.x")}</span></a>{/if}
		</div>
	{/if}
	<div class={!drifter ? "pointer-events-none filter-blur" : ""}>
		<fieldset disabled={!drifter} class="flex flex-col gap-2 pt-2 px-2 pb-1 border-2 border-solid border-weak rounded-1">
			<article class="flex flex-col min-h-20 overflow-auto resize-y">
				<textarea hidden={preview} placeholder="   {t('comment.placeholder')}" bind:this={textarea} bind:value={content} class="grow w-full bg-transparent text-4 outline-none resize-none"></textarea>
				{#if preview}
					{#await remark.process(content) then html}
						<div class="markdown comment">{@html html}</div>
					{/await}
				{/if}
			</article>
			<section class="flex items-center gap-2">
				<figure class="relative group">
					<figcaption class="line-height-none">{@render icon.emoji()}</figcaption>
					<ul class="absolute bottom-full left--3 flex items-center gap-2 mb-1 border-2 border-solid border-weak rounded-1 py-2 px-3 bg-background shadow-md pop">
						{#each emojis as emoji}
							<button onclick={() => insert_emoji(emoji.code)}>{emoji.icon}</button>
						{/each}
						<a href="https://github.com/ikatyang/emoji-cheat-sheet?tab=readme-ov-file#table-of-contents" target="_blank">…</a>
					</ul>
				</figure>
				<label class="flex items-center cursor-pointer">{@render icon.preview()}<input type="checkbox" class="switch" bind:checked={preview} /></label>
				<div class="grow"></div>
				<button id="submit" class="rounded-1 py-1 px-2 c-background bg-secondary" disabled={!drifter || limit > 0} onclick={submit_comment}>{limit > 0 ? t("comment.delay", { seconds: Math.ceil(limit) }) : edit ? t("comment.edit.name") : t("comment.submit")}</button>
			</section>
		</fieldset>
	</div>
</main>

<script lang="ts">
	import { actions } from "astro:actions";
	import { slide } from "svelte/transition";
	import remark from "$utils/remark";
	import { push_tip } from "$components/Tip.svelte";
	import i18nit from "$i18n";

	let { locale, OAuth, drifter, section, item, reply, edit, text, icon, refresh, view = $bindable(), limit = $bindable(0) }: { locale: string; OAuth: any; drifter?: string; section: string; item: string; reply?: string; edit?: string; text?: string; icon: any; refresh: any; view?: boolean; limit?: number } = $props();

	const t = i18nit(locale);

	let content: string = $state(text ?? ""); // Comment content, initialize with existing text if editing
	let preview: boolean = $state(false); // Toggle between edit and preview mode

	// Predefined emoji shortcuts for quick insertion
	const emojis = [
		{ code: ":joy:", icon: "😂" },
		{ code: ":sob:", icon: "😭" },
		{ code: ":heart:", icon: "❤️" },
		{ code: ":pray:", icon: "🙏" },
		{ code: ":kissing_heart:", icon: "😘" },
		{ code: ":smirk:", icon: "😏" },
		{ code: ":cry:", icon: "😢" },
		{ code: ":weary:", icon: "😩" },
		{ code: ":fearful:", icon: "😨" },
		{ code: ":rage:", icon: "😡" }
	];

	let textarea: HTMLTextAreaElement | null = $state(null);

	/**
	 * Insert emoji at current cursor position in textarea
	 */
	function insert_emoji(emoji: string) {
		if (textarea) {
			// Get current cursor position
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;

			// Insert emoji at cursor position and update content
			textarea.value = content = content.slice(0, start) + emoji + content.slice(end);

			// Move cursor to end of inserted emoji
			textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
			textarea.focus();
		}
	}

	/**
	 * Create or edit comment with validation and rate limiting
	 */
	async function submit_comment() {
		// Validate content is not empty (only for new comments)
		if (content.trim() === "") return push_tip("warning", t("comment.empty"));

		// Call appropriate API action based on whether we're editing or creating
		const { data, error } = edit ? await actions.comment.edit({ ID: edit, content }) : await actions.comment.create({ section, item, reply, content, link: location.href });

		if (!error) {
			// Refresh comment list to show updated comment
			refresh();

			// Implement rate limiting: 5-second cooldown
			limit = 5;
			let end = Date.now() + 1000 * limit;
			const interval = setInterval(() => (limit = (end - Date.now()) / 1000) <= 0 && clearInterval(interval), 100);

			// Reset form state after successful submission
			view = false;
			content = "";
			textarea?.blur();

			push_tip("success", t("comment.success"));
		} else {
			// Handle different error types
			switch (error.code) {
				case "TOO_MANY_REQUESTS":
					return push_tip("error", t("comment.limit"));

				default:
					return push_tip("error", t("comment.failure"));
			}
		}
	}
</script>

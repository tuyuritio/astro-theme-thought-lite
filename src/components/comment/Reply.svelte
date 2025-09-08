<Modal bind:open={anchor_view}>
	<div class="flex flex-col items-center gap-5">
		<h2>{t("drifter.signin")}</h2>

		<ul class="flex flex-col gap-1 list-inside mx-4">
			<li>{t("oauth.benefit.captcha")}</li>
			<li>{t("oauth.benefit.comment")}</li>
			<li>{t("oauth.benefit.notification")}</li>
			<li>{t("oauth.benefit.homepage")}</li>
		</ul>

		<hr class="border-b-1 border-b-dashed w-full" />

		<div class="flex flex-col items-center gap-2 [&>a]:(flex items-center justify-center gap-2 w-200px border-2 border-solid border-secondary p-1 rounded-1 font-bold)">
			{#if OAuth.GitHub}<a href="/drifter/anchor/GitHub">{@render icon.GitHub()}<span>{t("oauth.github")}</span></a>{/if}
			{#if OAuth.Google}<a href="/drifter/anchor/Google">{@render icon.Google()}<span>{t("oauth.google")}</span></a>{/if}
			{#if OAuth.X}<a href="/drifter/anchor/X">{@render icon.X()}<span>{t("oauth.x")}</span></a>{/if}
		</div>

		<button class="form-button" onclick={() => (anchor_view = false)}>{t("cancel")}</button>
	</div>
</Modal>

<Drifter bind:open={docker_view} {locale} {drifter} {icon} />

<main transition:slide={{ duration: 150 }} class="relative mt-5">
	{#if !turnstile && !drifter}
		<div class="absolute flex flex-col items-center justify-center gap-1 w-full h-full font-bold cursor-not-allowed">
			<button onclick={() => (anchor_view = true)} class="border-2 border-solid py-1 px-2 rounded-1 font-bold">{t("comment.signin")}</button>
		</div>
	{/if}
	<div class={!turnstile && !drifter ? "pointer-events-none filter-blur" : ""}>
		<fieldset class="flex flex-col gap-2 p-2 border-2 border-solid border-weak rounded-1">
			<article class="flex flex-col min-h-20 overflow-auto resize-y">
				<textarea hidden={preview} placeholder="   {t('comment.placeholder')}" bind:this={textarea} bind:value={content} class="grow w-full bg-transparent text-4 outline-none resize-none"></textarea>
				{#if preview}
					{#if content.trim()}
						{#await remark.process(content)}
							{@render icon.rendering()}
						{:then html}
							<div class="markdown comment">{@html html}</div>
						{/await}
					{:else}
						<span class="grow flex items-center justify-center font-bold c-weak">&lt;{t("comment.preview.empty")}&gt;</span>
					{/if}
				{/if}
			</article>
			<section class="flex items-center gap-2">
				<figure class="relative group">
					<figcaption class="line-height-none">{@render icon.emoji()}</figcaption>
					<ul class="absolute bottom-full left--3 flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 mb-1 border-2 border-solid border-weak rounded-1 py-2 px-3 bg-background shadow-md pop">
						{#each emojis as emoji}
							<button onclick={() => insert_emoji(emoji.code)}>{emoji.icon}</button>
						{/each}
						<a href="https://github.com/ikatyang/emoji-cheat-sheet?tab=readme-ov-file#table-of-contents" target="_blank">…</a>
					</ul>
				</figure>
				<label class="flex items-center cursor-pointer">{@render icon.preview()}<input type="checkbox" class="switch" bind:checked={preview} /></label>
				<div class="grow"></div>
				{#if nomad}
					<div bind:this={turnstile_element}></div>
					<input type="text" placeholder={t("comment.nickname.name")} bind:value={nickname} class="input border-weak w-35" />
					<button onclick={() => (anchor_view = true)}>{@render icon.signin()}</button>
				{:else}
					<button onclick={() => (docker_view = true)}>{@render icon.profile()}</button>
				{/if}
				<button id="submit" disabled={limit > 0 || (nomad && !CAPTCHA)} onclick={submit_comment}>
					{#if limit > 0}
						<span class="flex gap-0.5">{@render icon.delay()}<span class="font-mono pt-1">{Math.ceil(limit)}</span></span>
					{:else if nomad && !CAPTCHA}
						<span class="contents c-primary">{@render icon.verifying()}</span>
					{:else}
						{@render (edit ? icon.edit : icon.submit)()}
					{/if}
				</button>
			</section>
		</fieldset>
	</div>
</main>

<script lang="ts">
	import { actions } from "astro:actions";
	import { slide } from "svelte/transition";
	import { onMount } from "svelte";
	import remark from "$utils/remark";
	import Modal from "$components/Modal.svelte";
	import { push_tip } from "$components/Tip.svelte";
	import i18nit from "$i18n";
	import Drifter from "./Drifter.svelte";

	let { locale, OAuth, turnstile, drifter, section, item, reply, edit, text, icon, refresh, view = $bindable(), limit = $bindable(0) }: { locale: string; OAuth: any; turnstile?: string; drifter?: any; section: string; item: string; reply?: string; edit?: string; text?: string; icon: any; refresh: any; view?: boolean; limit?: number } = $props();

	const t = i18nit(locale);

	let anchor_view: boolean = $state(false); // OAuth signin view state
	let docker_view: boolean = $state(false); // User profile view state
	let content: string = $state(text ?? ""); // Comment content, initialize with existing text if editing
	let preview: boolean = $state(false); // Toggle between edit and preview mode
	let nomad: boolean = $state(!!turnstile && !drifter); // Check if unauthenticated comments are allowed
	let nickname: string | null = $state(null);
	let CAPTCHA: string | undefined = $state();
	let turnstile_element: HTMLElement | undefined = $state();
	let turnstile_ID: string | undefined = $state();

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
		// Validate content is not empty
		if (!content.trim()) return push_tip("warning", t("comment.empty"));

		// If nomad mode is enabled, validate CAPTCHA and nickname
		if (nomad) {
			if (!CAPTCHA) return push_tip("error", t("comment.verify.failure"));
			if (!nickname?.trim()) return push_tip("warning", t("comment.nickname.empty"));
		}

		// Call appropriate API action based on whether editing or creating
		const { data, error } = edit ? await actions.comment.edit({ ID: edit, content }) : await actions.comment.create({ section, item, reply, content, link: location.href, nickname, CAPTCHA });

		if (nomad) {
			// Only reset turnstile for top-level comments (when reply is undefined) or if there was an error
			if (!reply || error) {
				window.turnstile.reset(turnstile_ID);
				CAPTCHA = undefined;
			}

			localStorage.setItem("nickname", nickname!);
		}

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

				case "FORBIDDEN":
					return push_tip("error", t("comment.verify.failure"));

				default:
					return push_tip("error", t("comment.failure"));
			}
		}
	}

	onMount(() => {
		// If nomad is enabled and user is not authenticated, show nickname input and Turnstile widget
		if (nomad) {
			nickname = localStorage.getItem("nickname");

			/**
			 * Render Turnstile widget
			 */
			function init_turnstile() {
				turnstile_ID = window.turnstile.render(turnstile_element, {
					sitekey: turnstile,
					callback: (token: string) => {
						CAPTCHA = token;
					},
					"expired-callback": () => {
						CAPTCHA = undefined;
					},
					"error-callback": () => {
						CAPTCHA = undefined;
					}
				});
			}

			// Check if turnstile is available and render immediately
			if (window.turnstile) {
				init_turnstile();
			} else {
				window.onloadTurnstileCallback = init_turnstile;
			}
		}
	});
</script>

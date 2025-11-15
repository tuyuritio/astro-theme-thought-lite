<script lang="ts">
import { actions } from "astro:actions";
import { slide } from "svelte/transition";
import { onMount } from "svelte";
import remark from "$utils/remark";
import Modal from "$components/Modal.svelte";
import { pushTip } from "$components/Tip.svelte";
import config from "$config";
import i18nit from "$i18n";
import Drifter from "./Drifter.svelte";

let {
	locale,
	oauth,
	turnstile,
	drifter,
	section,
	item,
	reply,
	edit,
	text,
	icon,
	refresh,
	view = $bindable(),
	limit = $bindable(0)
}: {
	locale: string;
	oauth: any;
	turnstile?: string;
	drifter?: any;
	section: string;
	item: string;
	reply?: string;
	edit?: string;
	text?: string;
	icon: any;
	refresh: any;
	view?: boolean;
	limit?: number;
} = $props();

const t = i18nit(locale);

let anchorView: boolean = $state(false); // OAuth signin view state
let dockerView: boolean = $state(false); // User profile view state
let content: string = $state(text ?? ""); // Comment content, initialize with existing text if editing
let preview: boolean = $state(false); // Toggle between edit and preview mode
let nomad: boolean = $state(!!turnstile && !drifter); // Check if unauthenticated comments are allowed
let nickname: string | null = $state(null);
let captcha: string | undefined = $state();
let turnstileElement: HTMLElement | undefined = $state();
let turnstileID: string | undefined = $state();
let overlength: boolean = $derived(content.length > Number(config.comment?.["max-length"]));

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
function insertEmoji(emoji: string) {
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
async function submitComment() {
	// Validate content is not empty
	if (!content.trim()) return pushTip("warning", t("comment.empty"));

	// If nomad mode is enabled, validate CAPTCHA and nickname
	if (nomad) {
		if (!captcha) return pushTip("error", t("comment.verify.failure"));
		if (!nickname?.trim()) return pushTip("warning", t("comment.nickname.empty"));
	}

	// Call appropriate API action based on whether editing or creating
	const { data, error } = edit
		? await actions.comment.edit({ id: edit, content })
		: await actions.comment.create({ section, item, reply, content, link: location.origin + location.pathname, nickname, captcha: captcha });

	if (nomad) {
		// Only reset turnstile for top-level comments (when reply is undefined) or if there was an error
		if (!reply || error) {
			window.turnstile.reset(turnstileID);
			captcha = undefined;
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

		pushTip("success", t("comment.success"));
	} else {
		// Handle different error types
		switch (error.code) {
			case "TOO_MANY_REQUESTS":
				return pushTip("error", t("comment.limit"));

			case "CONTENT_TOO_LARGE":
				return pushTip("error", t("comment.overlength"));

			case "FORBIDDEN":
				return pushTip("error", t("comment.verify.failure"));

			default:
				return pushTip("error", t("comment.failure"));
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
		function initTurnstile() {
			turnstileID = window.turnstile.render(turnstileElement, {
				sitekey: turnstile,
				callback: (token: string) => {
					captcha = token;
				},
				"expired-callback": () => {
					captcha = undefined;
				},
				"error-callback": () => {
					captcha = undefined;
				}
			});
		}

		// Check if turnstile is available and render immediately
		if (window.turnstile) {
			initTurnstile();
		} else {
			window.onloadTurnstileCallback = initTurnstile;
		}
	}
});
</script>

<Modal bind:open={anchorView}>
	<div class="flex flex-col items-center gap-5">
		<h2>{t("drifter.signin")}</h2>

		<ul class="flex flex-col gap-1 list-inside mx-4">
			<li>{t("oauth.benefit.captcha")}</li>
			<li>{t("oauth.benefit.comment")}</li>
			<li>{t("oauth.benefit.notification")}</li>
			<li>{t("oauth.benefit.homepage")}</li>
		</ul>

		<hr class="b-b-1 b-b-dashed w-full" />

		<div class="flex flex-col items-center gap-2 [&>a]:(flex items-center justify-center gap-2 w-200px b-2 b-solid b-secondary p-1 rd-1 font-bold)">
			{#if oauth.github}<a href="/drifter/anchor/GitHub">{@render icon.github()}<span>{t("oauth.github")}</span></a>{/if}
			{#if oauth.google}<a href="/drifter/anchor/Google">{@render icon.google()}<span>{t("oauth.google")}</span></a>{/if}
			{#if oauth.x}<a href="/drifter/anchor/X">{@render icon.x()}<span>{t("oauth.x")}</span></a>{/if}
		</div>

		<button class="form-button" onclick={() => (anchorView = false)}>{t("cancel")}</button>
	</div>
</Modal>

<Drifter bind:open={dockerView} {locale} {drifter} {icon} />

<main transition:slide={{ duration: 150 }} class="relative mt-5">
	{#if !turnstile && !drifter}
		<div class="absolute flex flex-col items-center justify-center gap-1 w-full h-full font-bold cursor-not-allowed">
			<button onclick={() => (anchorView = true)} class="b-2 b-solid py-1 px-2 rd-1 font-bold">{t("comment.signin")}</button>
		</div>
	{/if}
	<div class={!turnstile && !drifter ? "pointer-events-none filter-blur" : ""}>
		<fieldset class="flex flex-col gap-2 p-2 b-2 b-solid b-weak rd-1">
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
				<figure class="relative flex items-center group">
					<figcaption class="contents">{@render icon.emoji()}</figcaption>
					<ul class="absolute bottom-full left--3 flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 mb-1 b-2 b-solid b-weak rd-1 py-2 px-3 bg-background shadow-md pop">
						{#each emojis as emoji}
							<button onclick={() => insertEmoji(emoji.code)}>{emoji.icon}</button>
						{/each}
						<a href="https://github.com/ikatyang/emoji-cheat-sheet?tab=readme-ov-file#table-of-contents" target="_blank">…</a>
					</ul>
				</figure>
				<label class="flex items-center cursor-pointer">{@render icon.preview()}<input type="checkbox" class="switch" bind:checked={preview} /></label>
				<div class="grow"></div>
				{#if nomad}
					<div bind:this={turnstileElement}></div>
					<input type="text" placeholder={t("comment.nickname.name")} bind:value={nickname} class="input b-weak w-35" />
					<button onclick={() => (anchorView = true)}>{@render icon.signin()}</button>
				{:else}
					<button onclick={() => (dockerView = true)}>{@render icon.profile()}</button>
				{/if}
				<button id="submit" disabled={limit > 0 || (nomad && !captcha) || overlength} onclick={submitComment}>
					{#if limit > 0}
						<span class="flex gap-0.5">{@render icon.delay()}<span class="relative top-0.5 font-mono line-height-none">{Math.ceil(limit)}</span></span>
					{:else if nomad && !captcha}
						<span class="contents c-primary">{@render icon.verifying()}</span>
					{:else if overlength}
						<span class="contents c-orange-6">{@render icon.overlength()}</span>
					{:else}
						{@render (edit ? icon.edit : icon.submit)()}
					{/if}
				</button>
			</section>
		</fieldset>
	</div>
</main>

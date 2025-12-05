<script lang="ts">
import { actions } from "astro:actions";
import { slide } from "svelte/transition";
import { onMount } from "svelte";
import remark from "$utils/remark";
import Icon from "$components/Icon.svelte";
import Modal from "$components/Modal.svelte";
import { pushTip } from "$components/Tip.svelte";
import config from "$config";
import i18nit from "$i18n";
import Drifter from "./Drifter.svelte";

let {
	locale,
	link,
	oauth,
	turnstile,
	drifter,
	section,
	item,
	reply,
	edit,
	text,
	refresh,
	view = $bindable(),
	limit = $bindable(0)
}: {
	locale: string;
	link: string;
	oauth: any;
	turnstile?: string;
	drifter?: any;
	section: string;
	item: string;
	reply?: string;
	edit?: string;
	text?: string;
	refresh: any;
	view?: boolean;
	limit?: number;
} = $props();

const t = i18nit(locale);

let anchorView: boolean = $state(false); // OAuth signin view state
let dockerView: boolean = $state(false); // User profile view state
let content: string = $state(""); // Comment content, will be initialized in onMount
let preview: boolean = $state(false); // Toggle between edit and preview mode
let nomad: boolean = $state(!!turnstile && !drifter); // Check if unauthenticated comments are allowed
let nickname: string | null = $state(null);
let captcha: string | undefined = $state();
let turnstileElement: HTMLElement | undefined = $state();
let turnstileID: string | undefined = $state();
let overlength: boolean = $derived(content.length > Number(config.comment?.["max-length"]));

// Generate storage key
const DRAFT_PREFIX = "comment-draft:";
const DRAFT_SAVE_DELAY = 500;

let draftKey = `${DRAFT_PREFIX}${section}:${item}`;
if (reply) draftKey += `:reply-${reply}`;
if (edit) draftKey += `:edit-${edit}`;

// Watch content changes and save draft with debounce
$effect(() => {
	// Trigger reactivity by referencing
	const current = content;

	// Save draft for both new comments and edits (when content differs from original)
	const debouncer = setTimeout(() => {
		if (current.trim() && current !== text) {
			localStorage.setItem(draftKey, current);
		} else {
			localStorage.removeItem(draftKey);
		}
	}, DRAFT_SAVE_DELAY);

	// Cleanup before re-running the effect or when the component unmounts
	return () => clearTimeout(debouncer);
});

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
		: await actions.comment.create({ section, item, reply, content, link, nickname, captcha: captcha });

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

		// Remove draft from localStorage upon successful submission
		localStorage.removeItem(draftKey);

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
	// Restore draft from localStorage
	const savedDraft = localStorage.getItem(draftKey);
	if (savedDraft) {
		content = savedDraft;
	} else if (text) {
		// For edit mode: use original text only when no draft exists
		content = text;
	}

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

		<hr class="border-0 border-b border-dashed w-full" />

		<div class="flex flex-col items-center gap-2 [&>a]:flex [&>a]:items-center [&>a]:justify-center [&>a]:gap-2 [&>a]:w-55 [&>a]:border-2 [&>a]:border-solid [&>a]:border-secondary [&>a]:p-1 [&>a]:rounded [&>a]:font-bold">
			{#if oauth.github}<a href="/drifter/anchor/GitHub"><Icon name="simple-icons--github" /><span>{t("oauth.github")}</span></a>{/if}
			{#if oauth.google}<a href="/drifter/anchor/Google"><Icon name="simple-icons--google" /><span>{t("oauth.google")}</span></a>{/if}
			{#if oauth.x}<a href="/drifter/anchor/X"><Icon name="simple-icons--x" /><span>{t("oauth.x")}</span></a>{/if}
		</div>

		<button class="form-button" onclick={() => (anchorView = false)}>{t("cancel")}</button>
	</div>
</Modal>

<Drifter bind:open={dockerView} {locale} {drifter} />

<main transition:slide={{ duration: 150 }} class="relative mt-5">
	{#if !turnstile && !drifter}
		<div class="absolute flex flex-col items-center justify-center gap-1 w-full h-full font-bold cursor-not-allowed">
			<button onclick={() => (anchorView = true)} class="border-2 py-1 px-2 rounded-sm font-bold">{t("comment.signin")}</button>
		</div>
	{/if}
	<div class={!turnstile && !drifter ? "pointer-events-none blur" : ""}>
		<fieldset class="flex flex-col gap-2 p-2 border-2 border-weak rounded-sm">
			<article class="flex flex-col min-h-20 overflow-auto resize-y">
				<textarea hidden={preview} placeholder="   {t('comment.placeholder')}" bind:this={textarea} bind:value={content} class="grow w-full bg-transparent text-base outline-none resize-none"></textarea>
				{#if preview}
					{#if content.trim()}
						{#await remark.process(content)}
							<Icon name="svg-spinners--pulse-3" size={30} />
						{:then html}
							<div class="markdown comment">{@html html}</div>
						{/await}
					{:else}
						<span class="grow flex items-center justify-center font-bold text-weak">&lt;{t("comment.preview.empty")}&gt;</span>
					{/if}
				{/if}
			</article>
			<section class="flex items-center gap-2">
				<figure class="relative flex items-center group">
					<figcaption class="contents"><Icon name="lucide--smile" /></figcaption>
					<ul class="absolute bottom-full -start-3 flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 mb-1 border-2 border-weak rounded-sm py-2 px-3 bg-background shadow-md pop">
						{#each emojis as emoji}
							<button onclick={() => insertEmoji(emoji.code)}>{emoji.icon}</button>
						{/each}
						<a href="https://github.com/ikatyang/emoji-cheat-sheet?tab=readme-ov-file#table-of-contents" target="_blank">…</a>
					</ul>
				</figure>
				<label class="flex items-center cursor-pointer"><Icon name="lucide--file-search" title={t("comment.preview.name")} /><input type="checkbox" class="switch" bind:checked={preview} /></label>
				<div class="grow"></div>
				{#if nomad}
					<div bind:this={turnstileElement}></div>
					<input type="text" placeholder={t("comment.nickname.name")} bind:value={nickname} class="input border-weak w-35 text-sm" />
					<button onclick={() => (anchorView = true)}><Icon name="lucide--user-round" title={t("drifter.signin")} /></button>
				{:else}
					<button onclick={() => (dockerView = true)}><Icon name="lucide--user-round-pen" title={t("drifter.profile")} /></button>
				{/if}
				<button id="submit" disabled={limit > 0 || (nomad && !captcha) || overlength} onclick={submitComment}>
					{#if limit > 0}
						<span class="flex gap-0.5"><Icon name="lucide--timer" /><span class="relative top-0.5 font-mono leading-none">{Math.ceil(limit)}</span></span>
					{:else if nomad && !captcha}
						<span class="contents text-primary"><Icon name="svg-spinners--pulse-rings-3" title={t("comment.verify.progress")} /></span>
					{:else if overlength}
						<span class="contents text-orange-600"><Icon name="lucide--rectangle-ellipsis" title={t("comment.overlength")} /></span>
					{:else if edit}
						<Icon name="lucide--pencil" title={t("comment.edit.name")} />
					{:else}
						<Icon name="lucide--send" title={t("comment.submit")} />
					{/if}
				</button>
			</section>
		</fieldset>
	</div>
</main>

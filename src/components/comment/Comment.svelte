<script lang="ts">
import { actions } from "astro:actions";
import config from "$config";
import remark from "$utils/remark";
import Time from "$utils/time";
import Icon from "$components/Icon.svelte";
import Modal from "$components/Modal.svelte";
import { pushTip } from "$components/Tip.svelte";
import i18nit from "$i18n";
import Self from "./Comment.svelte";
import Reply from "./Reply.svelte";

let {
	locale,
	link,
	oauth,
	turnstile,
	drifter,
	comment,
	refresh,
	depth = 0,
	limit = $bindable(0)
}: {
	locale: string;
	link: string;
	oauth: any;
	turnstile?: string;
	drifter?: any;
	comment: any;
	refresh: any;
	depth?: number;
	limit?: number;
} = $props();

const t = i18nit(locale);

/** Minimum nesting depth for comment threads to ensure proper display */
const MIN_DEPTH = 1;

/** Maximum nesting depth for comment threads to prevent infinite recursion */
const MAX_DEPTH = 4;

// Control visibility of reply and edit forms (mutually exclusive)
let replyView = $state(false);
let editView = $state(false);

// Control visibility of history and delete confirmation modals
let historyView = $state(false);
let deleteView = $state(false);

/**
 * Copy comment permalink to clipboard for sharing
 */
async function share() {
	await navigator.clipboard.writeText(`${location.origin}${location.pathname}#${comment.id}`);
	pushTip("success", t("comment.share.success"));
}

/**
 * Delete comment after confirmation
 */
async function remove() {
	const { error } = await actions.comment.delete({ id: comment.id });
	if (!error) {
		// Refresh comment list and close modal on successful deletion
		refresh();
		deleteView = false;

		pushTip("success", t("comment.remove.success"));
	} else {
		pushTip("error", t("comment.remove.failure"));
	}
}
</script>

<Modal bind:open={deleteView}>
	<div id="delete" class="flex flex-col items-center justify-center gap-5">
		<h2>{t("comment.remove.name")}</h2>
		<input type="hidden" name="ID" value={comment.id} />
		<time>{t("comment.time")}：{Time.full(comment.timestamp, Time.userTimezone)}</time>
		<section class="flex gap-5">
			<button class="form-button" onclick={() => (deleteView = false)}>{t("cancel")}</button>
			<button class="form-button" onclick={remove}>{t("confirm")}</button>
		</section>
	</div>
</Modal>

<Modal bind:open={historyView}>
	<div id="history" class="flex flex-col gap-5 max-h-[80vh]">
		<h3>{t("comment.edit.history")}</h3>
		<dl class="flex flex-col gap-2 overflow-y-auto">
			{#await actions.comment.history({ id: comment.id })}
				<div class="flex justify-center p-4"><Icon name="svg-spinners--3-dots-move" size={25} /></div>
			{:then response}
				{#if !response.error}
					{#each response.data.reverse() as item}
						<dt class="font-bold">{Time(item.timestamp)}</dt>
						{#await remark.process(item.content) then html}
							<dd class="markdown comment">{@html html}</dd>
						{/await}
					{/each}
				{:else}
					<div><Icon name="lucide--triangle-alert" /></div>
				{/if}
			{/await}
		</dl>
		<section><button class="form-button" onclick={() => (historyView = false)}>{t("confirm")}</button></section>
	</div>
</Modal>

<main id={comment.id} class:before:hidden={depth >= MIN_DEPTH} class:sm:before:block={depth < Math.max(MIN_DEPTH, MAX_DEPTH)} class="relative before:absolute before:content-[''] before:top-12 before:start-4 before:h-[calc(100%-2rem)] before:w-[0.2rem] before:bg-[linear-gradient(var(--shadow-color)_calc(100%-2rem),transparent)]">
	<dl class="flex flex-col gap-2 mt-6">
		<div class="flex items-center gap-2">
			{#if comment.name !== null}
				<img src={comment.image} alt="image-{comment.name}" class="w-9 h-9 border border-solid border-weak rounded-full" onerror={e => (((e.currentTarget as HTMLImageElement).onerror = null), ((e.currentTarget as HTMLImageElement).src = "/akkarin.webp"))} />
				<dt class="flex flex-col gap-0.5 min-w-0">
					<p class="flex items-center gap-1">
						<b>{comment.name}</b>
						{#if comment.author}<Icon name="lucide--signature" title={t("comment.author")} />{/if}
						{#if comment.homepage}<a href={comment.homepage} target="_blank" class="inline-flex"><Icon name="lucide--house" /></a>{/if}
						<span>·</span>
						<time class="text-xs">{Time(comment.updated ?? comment.timestamp, Time.userTimezone).replace("-", " ")}</time>
					</p>
					{#if comment.description}<span title={comment.description} class="text-secondary text-xs leading-normal truncate">{comment.description}</span>{/if}
				</dt>
			{:else}
				<img src={comment.nickname ? "/scribe.webp" : "/akkarin.webp"} alt="Default avatar" class="w-9 h-9 border border-solid border-weak rounded-full" />
				<dt class="flex flex-col gap-0.5 min-w-0">
					<p class="flex items-center gap-1">
						{#if comment.nickname}
							<b>{comment.nickname}</b>
						{:else}
							<b class="text-weak">{t("drifter.deactivate.done")}</b>
						{/if}
						<span>·</span>
						<time class="text-xs">{Time(comment.timestamp, Time.userTimezone).replace("-", " ")}</time>
					</p>
				</dt>
			{/if}
		</div>
		<blockquote class="ms-11">
			{#if comment.content}
				<div class="markdown comment">{#await remark.process(comment.content) then html}{@html html}{/await}</div>
				<dd class="flex items-center gap-4 mt-2">
					<button onclick={() => ((replyView = !replyView), (editView = false))} disabled={!turnstile && !(oauth.length && drifter)}><Icon name="lucide--reply" title={t("comment.reply")} /></button>
					{#if comment.updated && config.comment?.history}<button onclick={() => (historyView = true)}><Icon name="lucide--history" title={t("comment.history")} /></button>{/if}
					<button onclick={share}><Icon name="lucide--share-2" title={t("comment.share.name")} /></button>

					<!-- Show edit and delete buttons only if it's authenticated -->
					{#if oauth.length && comment.drifter === drifter?.id}
						<button onclick={() => ((editView = !editView), (replyView = false))}><Icon name="lucide--pencil" title={t("comment.edit.name")} /></button>
						<button onclick={() => (deleteView = true)}><Icon name="lucide--trash" title={t("delete")} /></button>
					{/if}
				</dd>
			{:else}
				<div class="flex items-center gap-1 mt-1 font-bold leading-none"><Icon name="lucide--triangle-alert" />{t("comment.removed")}<Icon name="lucide--triangle-alert" /></div>
			{/if}
		</blockquote>
	</dl>
	<div class:ms-7={depth < MIN_DEPTH} class:sm:ms-7={depth < Math.max(MIN_DEPTH, MAX_DEPTH)}>
		{#if replyView && !editView}
			<Reply {locale} {link} {oauth} {turnstile} {drifter} section={comment.section} item={comment.item} reply={comment.id} {refresh} bind:view={replyView} bind:limit />
		{:else if editView && !replyView}
			<Reply {locale} {link} {oauth} {turnstile} {drifter} section={comment.section} item={comment.item} reply={comment.reply} edit={comment.id} text={comment.content} {refresh} bind:view={editView} bind:limit />
		{/if}

		{#each comment.subcomments as subcomment}
			<Self {locale} {link} {oauth} {turnstile} {drifter} comment={subcomment} {refresh} depth={depth + 1} bind:limit />
		{/each}
	</div>
</main>

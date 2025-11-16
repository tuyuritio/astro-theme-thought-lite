<script lang="ts">
import { actions } from "astro:actions";
import remark from "$utils/remark";
import Time from "$utils/time";
import Modal from "$components/Modal.svelte";
import { pushTip } from "$components/Tip.svelte";
import i18nit from "$i18n";
import Self from "./Comment.svelte";
import Reply from "./Reply.svelte";

let {
	locale,
	oauth,
	turnstile,
	drifter,
	comment,
	icon,
	refresh,
	depth = 0,
	limit = $bindable(0)
}: {
	locale: string;
	oauth: any;
	turnstile?: string;
	drifter?: any;
	comment: any;
	icon: any;
	refresh: any;
	depth?: number;
	limit?: number;
} = $props();

const t = i18nit(locale);

// Minimum nesting depth for comment threads to ensure proper display
const MIN_DEPTH = 1;

// Maximum nesting depth for comment threads to prevent infinite recursion
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
	const { data, error } = await actions.comment.delete({ id: comment.id });
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
	<div id="history" class="flex flex-col gap-5">
		<h3>{t("comment.edit.history")}</h3>
		<dl class="flex flex-col gap-2">
			{#each comment.history as history}
				<dt class="font-bold">{Time(history.timestamp)}</dt>
				{#await remark.process(history.content) then html}
					<dd class="markdown comment">{@html html}</dd>
				{/await}
			{/each}
		</dl>
		<section><button class="form-button" onclick={() => (historyView = false)}>{t("confirm")}</button></section>
	</div>
</Modal>

<main id={comment.id} class:before:hidden={depth >= MIN_DEPTH} class:sm:before:block={depth < Math.max(MIN_DEPTH, MAX_DEPTH)} class="relative before:(absolute content-empty top-12 left-4 h-[calc(100%-2rem)] w-0.2rem bg-[linear-gradient(var(--shadow-color)calc(100%-2rem),transparent)])">
	<dl class="flex flex-col gap-2 mt-6">
		<div class="flex items-center gap-2">
			{#if comment.name !== null}
				<img src={comment.image} alt="image-{comment.name}" class="w-9 h-9 border b-solid b-weak rd-full" onerror={e => (((e.currentTarget as HTMLImageElement).onerror = null), ((e.currentTarget as HTMLImageElement).src = "/akkarin.webp"))} />
				<dt class="flex flex-col gap-0.5 min-w-0">
					<p class="flex items-center gap-1">
						<b>{comment.name}</b>
						{#if comment.author}{@render icon.author()}{/if}
						{#if comment.homepage}<a href={comment.homepage} target="_blank" class="inline-flex">{@render icon.home()}</a>{/if}
						<span>·</span>
						<time class="text-3">{Time(comment.timestamp, Time.userTimezone).replace("-", " ")}</time>
					</p>
					{#if comment.description}<span title={comment.description} class="c-secondary text-3 line-height-normal truncate">{comment.description}</span>{/if}
				</dt>
			{:else}
				<img src={comment.nickname ? "/nomad.webp" : "/akkarin.webp"} alt="Default avatar" class="w-9 h-9 b b-solid b-weak rd-full" />
				<dt class="flex flex-col gap-0.5 min-w-0">
					<p class="flex items-center gap-1">
						{#if comment.nickname}
							<b>{comment.nickname}</b>
						{:else}
							<b class="c-weak">{t("drifter.deactivate.done")}</b>
						{/if}
						<span>·</span>
						<time class="text-3">{Time(comment.timestamp, Time.userTimezone).replace("-", " ")}</time>
					</p>
				</dt>
			{/if}
		</div>
		<blockquote class="ml-11">
			{#if comment.content}
				<div class="markdown comment">{#await remark.process(comment.content) then html}{@html html}{/await}</div>
				<dd class="flex items-center gap-4 mt-2">
					<button onclick={() => ((replyView = !replyView), (editView = false))} disabled={!turnstile && !drifter}>{@render icon.reply()}</button>
					{#if comment.history.length > 0}<button onclick={() => (historyView = true)}>{@render icon.history()}</button>{/if}
					<button onclick={share}>{@render icon.share()}</button>
					{#if comment.drifter === drifter?.id}
						<button onclick={() => ((editView = !editView), (replyView = false))}>{@render icon.edit()}</button>
						<button onclick={() => (deleteView = true)}>{@render icon.remove()}</button>
					{/if}
				</dd>
			{:else}
				<div class="flex items-center gap-1 mt-1 font-bold line-height-none">{@render icon.alert()}{t("comment.removed")}{@render icon.alert()}</div>
			{/if}
		</blockquote>
	</dl>
	<div class:ml-7={depth < MIN_DEPTH} class:sm:ml-7={depth < Math.max(MIN_DEPTH, MAX_DEPTH)}>
		{#if replyView && !editView}
			<Reply {locale} {oauth} {turnstile} {drifter} section={comment.section} item={comment.item} reply={comment.id} {icon} {refresh} bind:view={replyView} bind:limit />
		{:else if editView && !replyView}
			<Reply {locale} {oauth} {turnstile} {drifter} section={comment.section} item={comment.item} reply={comment.reply} edit={comment.id} text={comment.content} {icon} {refresh} bind:view={editView} bind:limit />
		{/if}

		{#each comment.subcomments as subcomment}
			<Self {locale} {oauth} {turnstile} {drifter} comment={subcomment} {icon} {refresh} depth={depth + 1} bind:limit />
		{/each}
	</div>
</main>

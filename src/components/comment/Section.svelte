<script lang="ts">
import { actions } from "astro:actions";
import { onMount, type Snippet } from "svelte";
import { flip } from "svelte/animate";
import type { CommentItem } from "$actions/comment";
import { pushTip } from "$components/Tip.svelte";
import i18nit from "$i18n";
import CommentBlock from "./Comment.svelte";
import Reply from "./Reply.svelte";

let {
	locale,
	section,
	item,
	oauth,
	turnstile,
	author,
	home,
	alert,
	reload,
	asc,
	desc,
	reply,
	history,
	share,
	edit,
	remove,
	emoji,
	preview,
	signin,
	profile,
	submit,
	delay,
	overlength,
	loading,
	rendering,
	verifying,
	github,
	google,
	x,
	sync,
	signout,
	deactivate
}: { locale: string; nomad: boolean; section: string; item: string; oauth: any; turnstile?: string } & { [key: string]: Snippet } = $props();

// Group all icon snippets into a single object for easier prop passing
const icon = {
	author,
	home,
	alert,
	reply,
	history,
	share,
	edit,
	remove,
	emoji,
	preview,
	signin,
	profile,
	submit,
	delay,
	overlength,
	loading,
	rendering,
	verifying,
	github,
	google,
	x,
	sync,
	signout,
	deactivate
};

const t = i18nit(locale);

// Track rate limiting state across comment operations
let limit: number = $state(0);
let loaded: boolean = $state(false);
let drifter: any | undefined = $state();

let count: number = $state(0);
let comments: CommentItem[] = $state([]);
let ascending: boolean = $state(false);
let list: CommentItem[] = $derived(ascending ? comments : [...comments].reverse());

/**
 * Refresh comment list
 * @param auto - Whether this is an automatic refresh (default true)
 */
async function refresh(auto: boolean = true) {
	const { data, error } = await actions.comment.list({ section, item });
	if (!error) {
		if (!auto) {
			if (data.count > count) {
				pushTip("success", t("comment.reload.increase"));
			} else {
				pushTip("information", t("comment.reload.same"));
			}
		}

		count = data.count;
		comments = data.treeification;
	} else {
		pushTip("error", t("comment.fetch.failure"));
	}
}

onMount(async () => {
	let loadComments = false;
	let loadDrifter = false;

	// Initial load of comments
	const { data: commentList, error: commentError } = await actions.comment.list({ section, item });
	if (!commentError) {
		count = commentList.count;
		comments = commentList.treeification;

		loadComments = true;
	} else {
		pushTip("error", t("comment.fetch.failure"));
	}

	// Initial load of user authentication status
	const { data: drifterProfile, error: drifterError } = await actions.drifter.profile();
	if (!drifterError) {
		drifter = drifterProfile;

		loadDrifter = true;
	} else {
		pushTip("error", t("drifter.fetch.failure"));
	}

	loaded = loadComments && loadDrifter;
});
</script>

<main>
	{#if loaded}
		<Reply {locale} {oauth} {turnstile} {section} {item} {drifter} {icon} {refresh} bind:limit />
		{#if comments.length}
			<div class="flex items-center justify-between mt-6">
				<p class="flex items-center gap-2">
					<b class="text-4.5">{t("comment.name")}</b>
					<span>·</span>
					<span>{count}</span>
				</p>
				<p class="flex gap-4">
					<button onclick={() => refresh(false)}>{@render reload()}</button>
					<button onclick={() => (ascending = !ascending)}>
						{#if ascending}
							{@render asc()}
						{:else}
							{@render desc()}
						{/if}
					</button>
				</p>
			</div>
		{/if}
		{#each list as comment (comment.id)}
			<div animate:flip={{ duration: 150 }}>
				<CommentBlock {locale} {oauth} {turnstile} {icon} {drifter} {comment} {refresh} bind:limit />
			</div>
		{/each}
	{:else}
		<i class="block w-full text-center mt-10">{@render loading()}</i>
	{/if}
</main>

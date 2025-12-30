<script lang="ts">
import { actions } from "astro:actions";
import { onMount } from "svelte";
import { flip } from "svelte/animate";
import config from "$config";
import type { CommentItem } from "$actions/comment";
import Icon from "$components/Icon.svelte";
import { pushTip } from "$components/Tip.svelte";
import i18nit from "$i18n";
import CommentBlock from "./Comment.svelte";
import Reply from "./Reply.svelte";
import context from "./context.svelte";

let {
	locale,
	link,
	section,
	item,
	oauth,
	turnstile,
	push,
	email,
	compact = false
}: {
	locale: string;
	link: string;
	section: string;
	item: string;
	oauth: any;
	turnstile?: string;
	push?: string;
	email: boolean;
	compact?: boolean;
} = $props();

context.locale = locale;
context.link = link;
context.section = section;
context.item = item;
context.oauth = oauth;
context.turnstile = turnstile;
context.push = push;
context.email = email;
context.refresh = refresh;

const t = i18nit(locale);

let loaded: boolean = $state(false);
let expanded: boolean = $state(!compact);

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
	let loadDrifter = false;
	let loadComments = false;

	// Initial load of user authentication status
	const { data: drifterProfile, error: drifterError } = await actions.drifter.profile();
	if (!drifterError) {
		context.drifter = drifterProfile;

		loadDrifter = true;
	} else {
		pushTip("error", t("drifter.fetch.failure"));
	}

	// Initial load of comments
	const { data: commentList, error: commentError } = await actions.comment.list({ section, item });
	if (!commentError) {
		count = commentList.count;
		comments = commentList.treeification;

		loadComments = true;
	} else {
		pushTip("error", t("comment.fetch.failure"));
	}

	// Initial load of push subscription status
	// Register service worker for push notifications
	const registration = await navigator.serviceWorker.register("/sw.js");
	const subscription = await registration.pushManager.getSubscription();

	if (subscription) {
		// Verify subscription is still valid on server
		const { data } = await actions.push.check(subscription.endpoint);
		if (data) {
			context.subscription = data;
		} else {
			// Clean up invalid subscription
			await subscription.unsubscribe();
		}
	}

	loaded = loadComments && loadDrifter;
});
</script>

<main>
	{#if (!compact || expanded) && loaded}
		<Reply />
	{/if}

	{#if loaded}
		{#if compact || comments.length}
			<div class="flex items-center justify-between mt-6">
				<p class="flex items-center gap-2">
					<b class="text-lg">{t("comment.name")}</b>
					<span>·</span>
					<span>{count}</span>
				</p>

				{#if compact}
					<button onclick={() => (expanded = !expanded)}>
						{#if expanded}
							<Icon name="lucide--chevrons-down" title={t("comment.collapse")} />
						{:else}
							<Icon name="lucide--chevrons-up" title={t("comment.expand")} />
						{/if}
					</button>
				{/if}

				<p class="flex gap-4">
					<button onclick={() => refresh(false)}><Icon name="lucide--refresh-cw" title={t("comment.reload.name")} /></button>
					<button onclick={() => (ascending = !ascending)}>
						{#if ascending}
							<Icon name="lucide--clock-arrow-down" title={t("comment.sort.asc")} />
						{:else}
							<Icon name="lucide--clock-arrow-up" title={t("comment.sort.desc")} />
						{/if}
					</button>
				</p>
			</div>
		{/if}
		{#each list as comment (comment.id)}
			<div animate:flip={{ duration: 150 }}>
				{#if !comment.deleted || comment.subcomments.length || !config.comment?.["hide-deleted"]}
					<CommentBlock {comment} />
				{/if}
			</div>
		{/each}
	{:else}
		<i class="block w-full text-center mt-10"><Icon name="svg-spinners--3-dots-move" size={25} /></i>
	{/if}
</main>

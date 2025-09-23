<main>
	{#if loaded}
		<Reply {locale} {OAuth} {turnstile} {section} {item} {drifter} {icon} {refresh} bind:limit />
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
		{#each list as comment (comment.ID)}
			<div animate:flip={{ duration: 150 }}>
				<CommentBlock {locale} {OAuth} {turnstile} {icon} {drifter} {comment} {refresh} bind:limit />
			</div>
		{/each}
	{:else}
		<i class="block w-full text-center mt-10">{@render loading()}</i>
	{/if}
</main>

<script lang="ts">
	import { actions } from "astro:actions";
	import { onMount, type Snippet } from "svelte";
	import { flip } from "svelte/animate";
	import type { Comment } from "$actions/comment";
	import { push_tip } from "$components/Tip.svelte";
	import i18nit from "$i18n";
	import CommentBlock from "./Comment.svelte";
	import Reply from "./Reply.svelte";

	let { locale, section, item, OAuth, turnstile, author, home, alert, reload, asc, desc, reply, history, share, edit, remove, emoji, preview, signin, profile, submit, delay, overlength, loading, rendering, verifying, GitHub, Google, X, sync, signout, deactivate }: { locale: string; nomad: boolean; section: string; item: string; OAuth: any; turnstile?: string } & { [key: string]: Snippet } = $props();

	// Group all icon snippets into a single object for easier prop passing
	const icon = { author, home, alert, reply, history, share, edit, remove, emoji, preview, signin, profile, submit, delay, overlength, loading, rendering, verifying, GitHub, Google, X, sync, signout, deactivate };

	const t = i18nit(locale);

	// Track rate limiting state across comment operations
	let limit: number = $state(0);
	let loaded: boolean = $state(false);
	let drifter: any | undefined = $state();

	let count: number = $state(0);
	let comments: Comment[] = $state([]);
	let ascending: boolean = $state(false);
	let list: Comment[] = $derived(ascending ? comments : [...comments].reverse());

	/**
	 * Refresh comment list
	 * @param auto - Whether this is an automatic refresh (default true)
	 */
	async function refresh(auto: boolean = true) {
		const { data, error } = await actions.comment.list({ section, item });
		if (!error) {
			if (!auto) {
				if (data.count > count) {
					push_tip("success", t("comment.reload.increase"));
				} else {
					push_tip("information", t("comment.reload.same"));
				}
			}

			count = data.count;
			comments = data.treeification;
		} else {
			push_tip("error", t("comment.fetch.failure"));
		}
	}

	onMount(async () => {
		let load_comments = false;
		let load_drifter = false;

		// Initial load of comments
		const { data: comment_list, error: comment_error } = await actions.comment.list({ section, item });
		if (!comment_error) {
			count = comment_list.count;
			comments = comment_list.treeification;

			load_comments = true;
		} else {
			push_tip("error", t("comment.fetch.failure"));
		}

		// Initial load of user authentication status
		const { data: drifter_profile, error: drifter_error } = await actions.drifter.profile();
		if (!drifter_error) {
			drifter = drifter_profile;

			load_drifter = true;
		} else {
			push_tip("error", t("drifter.fetch.failure"));
		}

		loaded = load_comments && load_drifter;
	});
</script>

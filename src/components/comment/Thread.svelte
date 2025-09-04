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
				<p class="flex gap-4 contain-layout">
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
		<i class="block w-full text-center">{@render loading()}</i>
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

	let { locale, section, item, OAuth, author, home, alert, reload, asc, desc, reply, history, share, edit, remove, emoji, preview, oauth, submit, delay, loading, rendering, verifying, GitHub, Google, X }: { locale: string; nomad: boolean; section: string; item: string; OAuth: any } & { [key: string]: Snippet } = $props();

	// Group all icon snippets into a single object for easier prop passing
	const icon = { author, home, alert, reply, history, share, edit, remove, emoji, preview, oauth, submit, delay, loading, rendering, verifying, GitHub, Google, X };

	const t = i18nit(locale);

	// Track rate limiting state across comment operations
	let limit: number = $state(0);
	let loaded: boolean = $state(false);
	let drifter: string | undefined = $state();
	let turnstile: string | undefined = $state();

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
		// Initial load of comments and user authentication status
		const { data, error } = await actions.comment.list({ section, item });
		if (!error) {
			// Set initial state with fetched comments
			count = data.count;
			comments = data.treeification;
			drifter = data.visa;
			turnstile = data.turnstile;

			loaded = true;
		} else {
			push_tip("error", t("comment.fetch.failure"));
		}
	});
</script>

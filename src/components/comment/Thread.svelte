<main>
	{#if loaded}
		<Reply {locale} {OAuth} {turnstile} {section} {item} {drifter} {icon} {refresh} bind:limit />
		{#each comments as comment}
			<CommentBlock {locale} {OAuth} {turnstile} {icon} {drifter} {comment} {refresh} bind:limit />
		{/each}
	{:else}
		<i class="block w-full text-center">{@render loading()}</i>
	{/if}
</main>

<script lang="ts">
	import { actions } from "astro:actions";
	import { onMount, type Snippet } from "svelte";
	import type { Comment } from "$actions/comment";
	import { push_tip } from "$components/Tip.svelte";
	import i18nit from "$i18n";
	import CommentBlock from "./Comment.svelte";
	import Reply from "./Reply.svelte";

	let { locale, section, item, OAuth, signature, home, mail, alert, reply, history, share, edit, remove, emoji, preview, loading, rendering, verifying, GitHub, Google, X }: { locale: string; nomad: boolean; section: string; item: string; OAuth: any; signature: Snippet; home: Snippet; mail: Snippet; alert: Snippet; reply: Snippet; history: Snippet; share: Snippet; edit: Snippet; remove: Snippet; emoji: Snippet; preview: Snippet; loading: Snippet; rendering: Snippet; verifying: Snippet; GitHub: Snippet; Google: Snippet; X: Snippet } = $props();

	// Group all icon snippets into a single object for easier prop passing
	const icon = { signature, home, mail, alert, reply, history, share, edit, remove, emoji, preview, loading, rendering, verifying, GitHub, Google, X };

	const t = i18nit(locale);

	// Track rate limiting state across comment operations
	let limit: number = $state(0);
	let comments: Comment[] = $state([]);

	/**
	 * Refresh comment list after operations
	 */
	async function refresh() {
		const { data, error } = await actions.comment.list({ section, item });
		if (!error) {
			comments = data.treeification;
		} else {
			push_tip("error", t("comment.fetch.failure"));
		}
	}

	let loaded: boolean = $state(false);
	let drifter: string | undefined = $state();
	let turnstile: string | undefined = $state();
	onMount(async () => {
		// Initial load of comments and user authentication status
		const { data, error } = await actions.comment.list({ section, item });
		if (!error) {
			// Set initial state with fetched comments
			comments = data.treeification;
			drifter = data.visa;
			turnstile = data.turnstile;

			loaded = true;
		} else {
			push_tip("error", t("comment.fetch.failure"));
		}
	});
</script>

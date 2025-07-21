<style lang="less">
	hr {
		border-bottom: 1px solid var(--weak-color);
	}
</style>

<Modal bind:open={deactivate_view}>
	<div class="flex flex-col items-center justify-center gap-5">
		<h2>{t("drifter.deactivate.title")}</h2>
		<div class="flex flex-col gap-4">
			<p class="self-center font-bold text-red">{t("drifter.deactivate.warning")}</p>
			<p>{t("drifter.deactivate.description")}</p>
			<ul class="ml-5 space-y-1">
				<li>{t("drifter.deactivate.consequences.data")}</li>
				<li>{t("drifter.deactivate.consequences.comments")}</li>
				<li>{t("drifter.deactivate.consequences.comment")}</li>
				<li>{t("drifter.deactivate.consequences.notification")}</li>
				<li>{t("drifter.deactivate.consequences.new")}</li>
			</ul>
		</div>
		<section class="flex gap-5">
			<button class="form-button" onclick={() => (deactivate_view = false)}>{t("drifter.deactivate.cancel")}</button>
			<button class="form-button bg-red text-white" onclick={deactivate}>{t("drifter.deactivate.confirm")}</button>
		</section>
	</div>
</Modal>

<main class="flex flex-col grow gap-8">
	<header class="flex h-25">
		<img src={drifter.image} alt={drifter.ID} loading="lazy" class="w-25 border-2 border-solid border-weak border-rd-full" />
		<aside class="flex flex-col justify-around ml-6">
			<menu class="flex items-center gap-3 text-5 font-bold">
				{#if drifter.platform == "GitHub"}
					{@render GitHub()}
				{:else if drifter.platform == "Google"}
					{@render Google()}
				{:else if drifter.platform == "X"}
					{@render X()}
				{/if}
				{drifter.name}
				<button onclick={synchronize}>{@render sync()}</button>
				<button onclick={() => (location.href = "/drifter/dock/sail")}>{@render signout()}</button>
			</menu>
			{#if drifter.description}<span id="description">{drifter.description}</span>{/if}
		</aside>
	</header>
	<hr />
	<div class="flex flex-col items-start gap-5">
		<section>
			<label class="flex items-center">{t("notification.name")}：<input type="checkbox" class="switch" bind:checked={notification} onchange={toggle_notification} /></label>
		</section>
		<section class="flex flex-col gap-2">
			<label>{t("drifter.homepage")}：<input type="url" bind:value={drifter.homepage} /></label>
		</section>
		<button onclick={update} class="border-rd-1 py-1 px-2 c-background bg-primary">{t("drifter.update.name")}</button>
	</div>
	<hr class="mt-a" />
	<button onclick={() => (deactivate_view = true)} class="self-start mb-5 border-2 border-solid c-red b-rd px-2 py-1 font-bold">{t("drifter.deactivate.name")}</button>
</main>

<script lang="ts">
	import { actions } from "astro:actions";
	import { onMount, type Snippet } from "svelte";
	import Modal from "$components/Modal.svelte";
	import i18nit from "$i18n";
	import { push_tip } from "./Tip.svelte";

	let { locale, drifter, GitHub, Google, X, sync, signout }: { locale: string; drifter: any; GitHub: Snippet; Google: Snippet; X: Snippet; sync: Snippet; signout: Snippet } = $props();

	const t = i18nit(locale);

	/**
	 * Fetch and update user profile data from OAuth provider
	 */
	async function synchronize() {
		push_tip("information", t("drifter.sync.fetch"));

		const { data, error } = await actions.drifter.synchronize();
		if (!error) {
			// Update local drifter object with fresh data from OAuth provider
			drifter.name = data.name;
			drifter.description = data.description;
			push_tip("success", t("drifter.sync.success"));
		} else {
			push_tip("error", t("drifter.sync.failure"));
		}
	}

	/**
	 * Toggle push notification subscription on/off
	 */
	async function toggle_notification() {
		const registration = await navigator.serviceWorker.ready;

		// Check for existing subscription to determine current state
		let subscription = await registration.pushManager.getSubscription();
		if (subscription) {
			// Unsubscribe from push notifications
			await subscription.unsubscribe();
			const { data, error } = await actions.notification.unsubscribe({ endpoint: subscription.endpoint });
			if (!error) {
				notification = false;
				push_tip("success", t("notification.disable.success"));
			} else {
				push_tip("error", t("notification.disable.failure"));
			}
		} else {
			// Request notification permission before subscribing
			const permission = await Notification.requestPermission();
			if (permission !== "granted") {
				notification = false;
				return push_tip("information", t("notification.denied"));
			}

			// Get VAPID public key for push subscription
			const { data: public_key, error: key_error } = await actions.notification.key();
			if (key_error) {
				notification = false;
				return push_tip("error", t("notification.enable.failure"));
			}

			// Create push subscription with VAPID key
			const subscription = (
				await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: public_key
				})
			).toJSON();

			// Register subscription with server
			const { data, error } = await actions.notification.subscribe({ locale, endpoint: subscription.endpoint!, p256dh: subscription.keys!.p256dh, auth: subscription.keys!.auth });
			if (!error) {
				notification = true;
				push_tip("success", t("notification.enable.success"));
			} else {
				notification = false;
				push_tip("error", t("notification.enable.failure"));
			}
		}
	}

	// Update user homepage URL
	async function update() {
		const { data, error } = await actions.drifter.update({ homepage: drifter.homepage });
		if (!error) {
			push_tip("success", t("drifter.update.success"));
		} else {
			push_tip("error", t("drifter.update.failure"));
		}
	}

	// Control deactivation confirmation modal
	let deactivate_view = $state(false);

	/**
	 * Permanently deactivate user account and clean up data
	 */
	async function deactivate() {
		const { data, error } = await actions.drifter.deactivate();
		if (!error) {
			// Clean up push notification subscription before account deletion
			const registration = await navigator.serviceWorker.ready;
			let subscription = await registration.pushManager.getSubscription();
			if (subscription) await subscription.unsubscribe();

			push_tip("success", t("drifter.deactivate.success"));
			// Redirect to home page after account deactivation
			setTimeout(() => (location.href = "/"), 2000);
		} else {
			push_tip("error", t("drifter.deactivate.failure"));
		}

		deactivate_view = false;
	}

	// Track push notification subscription state
	let notification: boolean = $state(false);
	onMount(async () => {
		// Register service worker for push notifications
		const registration = await navigator.serviceWorker.register("/sw.js");
		const subscription = await registration.pushManager.getSubscription();
		// Set initial notification state based on existing subscription
		notification = !!subscription;

		if (subscription) {
			// Verify subscription is still valid on server
			const { data, error } = await actions.notification.check({ endpoint: subscription.endpoint });
			if (error || !data) {
				// Clean up invalid subscription
				await subscription.unsubscribe();
				notification = false;
			}
		}
	});
</script>

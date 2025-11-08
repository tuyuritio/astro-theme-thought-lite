<script lang="ts">
import { actions } from "astro:actions";
import { onMount, type Snippet } from "svelte";
import Modal from "$components/Modal.svelte";
import { pushTip } from "$components/Tip.svelte";
import i18nit from "$i18n";

let { open = $bindable(), locale, drifter, icon }: { open: boolean; locale: string; drifter: any; icon: { [key: string]: Snippet } } = $props();

const t = i18nit(locale);

/**
 * Fetch and update user profile data from OAuth provider
 */
async function synchronize() {
	pushTip("information", t("drifter.sync.fetch"));

	const { data, error } = await actions.drifter.synchronize();
	if (!error) {
		// Update local drifter object with fresh data from OAuth provider
		drifter.name = data.name;
		drifter.description = data.description;
		pushTip("success", t("drifter.sync.success"));
	} else {
		pushTip("error", t("drifter.sync.failure"));
	}
}

/**
 * Toggle push notification subscription on/off
 */
async function toggleNotification() {
	const registration = await navigator.serviceWorker.ready;

	// Check for existing subscription to determine current state
	let subscription = await registration.pushManager.getSubscription();
	if (subscription) {
		// Unsubscribe from push notifications
		await subscription.unsubscribe();
		const { data, error } = await actions.notification.unsubscribe({ endpoint: subscription.endpoint });
		if (!error) {
			notification = false;
			pushTip("success", t("notification.disable.success"));
		} else {
			pushTip("error", t("notification.disable.failure"));
		}
	} else {
		// Request notification permission before subscribing
		const permission = await Notification.requestPermission();
		if (permission !== "granted") {
			notification = false;
			return pushTip("information", t("notification.denied"));
		}

		// Get VAPID public key for push subscription
		const { data: publicKey, error: keyError } = await actions.notification.key();
		if (keyError) {
			notification = false;
			return pushTip("error", t("notification.enable.failure"));
		}

		// Create push subscription with VAPID key
		const subscription = (
			await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: publicKey
			})
		).toJSON();

		// Register subscription with server
		const { data, error } = await actions.notification.subscribe({
			locale,
			endpoint: subscription.endpoint!,
			p256dh: subscription.keys!.p256dh,
			auth: subscription.keys!.auth
		});
		if (!error) {
			notification = true;
			pushTip("success", t("notification.enable.success"));
		} else {
			notification = false;
			pushTip("error", t("notification.enable.failure"));
		}
	}
}

// Update user homepage URL
async function update() {
	const { data, error } = await actions.drifter.update({ homepage: drifter.homepage });
	if (!error) {
		pushTip("success", t("drifter.update.success"));
	} else {
		pushTip("error", t("drifter.update.failure"));
	}
}

// Control deactivation confirmation modal
let deactivateView = $state(false);

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

		pushTip("success", t("drifter.deactivate.success"));
		// Redirect to home page after account deactivation
		setTimeout(() => (location.href = "/"), 2000);
	} else {
		pushTip("error", t("drifter.deactivate.failure"));
	}

	deactivateView = false;
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

<Modal bind:open={deactivateView}>
	<div class="flex flex-col items-center justify-center gap-5">
		<h2>{t("drifter.deactivate.title")}</h2>
		<div class="flex flex-col gap-4">
			<p class="self-center font-bold text-red-5">{t("drifter.deactivate.warning")}</p>
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
			<button class="form-button" onclick={() => (deactivateView = false)}>{t("drifter.deactivate.cancel")}</button>
			<button class="form-button bg-red-5 text-white" onclick={deactivate}>{t("drifter.deactivate.confirm")}</button>
		</section>
	</div>
</Modal>

<Modal bind:open>
	<main class="flex flex-col grow gap-5">
		<header class="flex flex-col sm:flex-row gap-5">
			<img src={drifter.image} alt={drifter.id} class="self-center w-20 b-2 b-solid b-weak rd-full" />
			<aside class="flex flex-col justify-around gap-2 sm:gap-0">
				<menu class="flex items-center gap-2 font-bold">
					{#if drifter.platform == "GitHub"}
						{@render icon.github()}
					{:else if drifter.platform == "Google"}
						{@render icon.google()}
					{:else if drifter.platform == "X"}
						{@render icon.x()}
					{/if}
					{drifter.name}
					<button onclick={synchronize}>{@render icon.sync()}</button>
					<button onclick={() => (location.href = "/drifter/sail")}>{@render icon.signout()}</button>
					<button onclick={() => (deactivateView = true)} class="ml-a c-red-5">{@render icon.deactivate()}</button>
				</menu>
				{#if drifter.description}<span class="text-3.5">{drifter.description}</span>{/if}
			</aside>
		</header>
		<hr class="b-b-1 b-b-solid b-weak" />
		<div class="flex flex-col items-start gap-5">
			<section>
				<label class="flex items-center">{t("notification.name")}：<input type="checkbox" class="switch" bind:checked={notification} onchange={toggleNotification} /></label>
			</section>
			<section class="flex flex-col gap-2">
				<label>{t("drifter.homepage")}：<input type="url" class="input" bind:value={drifter.homepage} /></label>
			</section>
		</div>
		<div class="self-center flex gap-5">
			<button onclick={() => (open = false)} class="form-button">{t("cancel")}</button>
			<button onclick={update} class="form-button">{t("drifter.update.name")}</button>
		</div>
	</main>
</Modal>

<script lang="ts">
import Modal from "$components/Modal.svelte";
import Icon from "$components/Icon.svelte";
import { pushTip } from "$components/Tip.svelte";
import i18nit from "$i18n";
import { actions } from "astro:actions";
import context, { countdownEmail } from "./context.svelte";

const t = i18nit(context.locale);

const drifter = $derived(context.drifter!);

let address: string | null = $state(drifter.email);
let edit: boolean = $state(false);
let limit = $derived(context.limitEmail);
let removeView = $state(false);

/**
 * Verify new email address
 */
async function verify() {
	if (!context.email) return pushTip("error", t("email.verify.send.failure"));
	if (limit > 0) return pushTip("warning", t("email.verify.limit"));
	if (!address?.trim()) return pushTip("error", t("email.empty"));

	const { error } = await actions.email.verify({ locale: context.locale, address });
	if (!error) {
		countdownEmail();
		edit = false;

		drifter.emailState = "pending";
		drifter.email = address;

		pushTip("information", t("email.verify.send.success"));
	} else {
		switch (error.code) {
			case "CONFLICT":
				pushTip("warning", t("email.verify.conflict"));
				break;

			case "TOO_MANY_REQUESTS":
				pushTip("warning", t("email.verify.limit"));
				break;

			default:
				pushTip("error", t("email.verify.send.failure"));
				break;
		}
	}
}

/**
 * Resend verification email
 */
async function resend() {
	if (limit > 0) return pushTip("warning", t("email.verify.limit"));

	const { error } = await actions.email.verify({ locale: context.locale });
	if (!error) {
		countdownEmail();

		pushTip("information", t("email.verify.send.success"));
	} else {
		switch (error.code) {
			case "TOO_MANY_REQUESTS":
				pushTip("warning", t("email.verify.limit"));
				break;

			default:
				pushTip("error", t("email.verify.send.failure"));
				break;
		}
	}
}

/**
 * Remove email address from user profile
 */
async function remove() {
	const { error } = await actions.email.remove();
	if (!error) {
		// await reloadProfile();
		removeView = false;
		edit = false;
		address = null;

		drifter.email = null;
		drifter.emailState = null;

		pushTip("success", t("email.remove.success"));
	} else {
		pushTip("error", t("email.remove.failure"));
	}
}
</script>

<Modal bind:open={removeView}>
	<div id="delete" class="flex flex-col items-center justify-center gap-5">
		<h2>{t("email.remove.name")}</h2>
		<section class="flex gap-5">
			<button class="form-button" onclick={() => (removeView = false)}>{t("cancel")}</button>
			<button class="form-button bg-red-500 text-white" onclick={remove}>{t("confirm")}</button>
		</section>
	</div>
</Modal>

<label class="flex items-center gap-1 flex-wrap">
	{t("email.name")}:
	<input type="email" disabled={!edit} bind:value={address} class="input" />

	<div class="flex gap-1 w-9.5">
		{#if edit}
			<button onclick={() => ((edit = false), (address = drifter.email))}><Icon name="lucide--x" /></button>
			{#if drifter.email === undefined || address?.trim()}
				<button onclick={verify}><Icon name="lucide--check" /></button>
			{:else if drifter.email}
				<button onclick={() => (removeView = true)}><Icon name="lucide--trash" title={t("email.remove.name")} /></button>
			{/if}
		{:else}
			{#if drifter.emailState === "verified"}
				<Icon name="lucide--badge-check" title={t("email.verify.done")} />
			{:else if context.limitEmail > 0}
				<span class="w-4.25 font-mono text-sm text-center">{Math.ceil(limit)}</span>
			{:else if drifter.email}
				<button onclick={resend}><Icon name="lucide--badge-question-mark" title={t("email.verify.resend")} /></button>
			{/if}
			<button onclick={() => (edit = true)}><Icon name="lucide--pencil" /></button>
		{/if}
	</div>
</label>

#!/usr/bin/env tsx

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { cancel, confirm, intro, isCancel, log, multiselect, note, outro, select, spinner, text } from "@clack/prompts";
import { DateTime } from "luxon";
import i18nit from "$i18n";
import config, { monolocale } from "../site.config";

const t = i18nit(config.i18n.defaultLocale, "script");

const CANCEL_MESSAGE = t("new.cancel");

// Main function: Interactive CLI script for creating new articles
!(async () => {
	console.clear();
	intro(`📝 ${t("new.welcome")}`);

	// Determine the base content directory path
	let path = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "content");

	// Select content type: Note, Jotting, or Preface
	const contentType = await select({
		message: t("new.step.type"),
		options: [
			{ label: t("new.note.name"), value: "note", hint: t("new.note.description") },
			{ label: t("new.jotting.name"), value: "jotting", hint: t("new.jotting.description") },
			{ label: t("new.preface.name"), value: "preface", hint: t("new.preface.description") }
		]
	});

	// Exit if user cancels the selection
	isCancel(contentType) && (cancel(CANCEL_MESSAGE), process.exit(0));

	// Update path based on selected content type
	path = join(path, contentType);

	// Select language for the article (skip if single language mode)
	let locale: string | symbol = config.i18n.defaultLocale;
	if (!monolocale) {
		locale = await select({
			message: t("new.step.language"),
			options: config.i18n.locales.map(locale => ({ label: i18nit(locale)("language"), value: locale })),
			initialValue: config.i18n.defaultLocale
		});

		// Exit if user cancels the selection
		isCancel(locale) && (cancel(CANCEL_MESSAGE), process.exit(0));

		// Update path based on selected locale
		path = join(path, locale);
	}

	// Generate timestamp in ISO format with timezone
	let content = "";
	const timestamp = DateTime.now().toFormat("yyyy-MM-dd HH:mm:ssZZ");

	// Generate frontmatter metadata based on content type
	const information: any = {};
	if (contentType === "preface") {
		// Preface uses timestamp as filename
		information.timestamp = timestamp;

		content += i18nit(locale, "script")("new.preface.start");
		// Generate filename from timestamp (e.g., 1970-01-01-00-00-00.md)
		path = join(path, `${timestamp.substring(0, 19).replace(/[\s:]/g, "-")}.md`);
	} else {
		// Note and Jotting require additional metadata
		content += i18nit(locale, "script")("new.article.start");

		// Prompt user to input article title
		const title = await text({
			message: t("new.step.title.name"),
			placeholder: t("new.step.title.placeholder"),
			validate: value => (value ? undefined : t("new.step.title.validate"))
		});

		// Exit if user cancels the input
		isCancel(title) && (cancel(CANCEL_MESSAGE), process.exit(0));

		information.title = title;
		information.timestamp = timestamp;

		// Slugify function: Convert title to URL-friendly slug
		// Normalizes Unicode, removes special characters, converts to lowercase and hyphens
		const slugify = (text: string) =>
			text
				.toLowerCase()
				.normalize("NFKC")
				.replace(/[^\p{L}\p{N}\s-]+/gu, "")
				.trim()
				.replace(/\s+/g, "-")
				.replace(/-+/g, "-")
				.replace(/^-+|-+$/g, "");

		// Prompt user to input content ID (filename)
		let id: string | symbol = slugify(title);
		id = await text({
			message: t("new.step.id.name"),
			placeholder: t("new.step.id.placeholder"),
			initialValue: id,
			validate: value => (value === slugify(value) ? undefined : t("new.step.id.validate"))
		});

		// Exit if user cancels the input
		isCancel(id) && (cancel(CANCEL_MESSAGE), process.exit(0));

		// If content type is Note, allow user to specify a series
		if (contentType === "note") {
			// Prompt user to input series name (optional)
			const series = await text({
				message: t("new.step.series.name"),
				placeholder: t("new.step.series.placeholder")
			});

			// Exit if user cancels the input
			isCancel(series) && (cancel(CANCEL_MESSAGE), process.exit(0));

			// Add series to frontmatter if provided
			if (series) information.series = series;
		}

		// Prompt user to input tags (comma-separated)
		const tags = await text({
			message: t("new.step.tags.name"),
			placeholder: t("new.step.tags.placeholder")
		});

		// Exit if user cancels the input
		isCancel(tags) && (cancel(CANCEL_MESSAGE), process.exit(0));

		// Add tags to frontmatter if provided
		if (tags) information.tags = `[${tags}]`;

		// Prompt user to input description (optional)
		const description = await text({
			message: t("new.step.description.name"),
			placeholder: t("new.step.description.placeholder")
		});

		// Exit if user cancels the input
		isCancel(description) && (cancel(CANCEL_MESSAGE), process.exit(0));

		// Add description to frontmatter if provided
		if (description) information.description = description;

		// Prompt user to select additional options (draft, toc, top, sensitive)
		const options = await multiselect({
			message: t("new.step.options.name"),
			options: [
				{ label: t("new.step.options.draft"), value: "draft" },
				...(contentType === "note" ? [{ label: t("new.step.options.toc"), value: "toc" }] : []),
				{ label: t("new.step.options.top"), value: "top" },
				{ label: t("new.step.options.sensitive"), value: "sensitive" }
			],
			initialValues: ["draft"],
			required: false
		});

		// Exit if user cancels the selection
		isCancel(options) && (cancel(CANCEL_MESSAGE), process.exit(0));

		// Add selected options to frontmatter
		if (options.includes("sensitive")) information.sensitive = true;
		if (options.includes("toc")) information.toc = true;
		if (options.includes("top")) information.top = 1;
		if (options.includes("draft")) information.draft = true;

		// Prompt user to choose file structure: flat (single .md file) or folder (with index.md)
		const folder = await select({
			message: t("new.step.structure.name"),
			options: [
				{ label: t("new.step.structure.flat"), value: "flat", hint: `${id}.md` },
				{ label: t("new.step.structure.folder"), value: "folder", hint: `${id}/index.md` }
			],
			initialValue: "flat"
		});

		// Exit if user cancels the selection
		isCancel(folder) && (cancel(CANCEL_MESSAGE), process.exit(0));

		// Set file path based on selected structure
		if (folder === "folder") {
			// Folder structure: content-type/locale/ID/index.md
			path = join(path, id, "index.md");
		} else {
			// Flat structure: content-type/locale/ID.md
			path = join(path, `${id}.md`);
		}
	}

	// Construct frontmatter with metadata and content template
	content = `---
${Object.entries(information)
	.map(([key, value]) => `${key}: ${value}`)
	.join("\n")}
---

${content}
`;

	// Display the generated content to the user for review
	`${note(content, t("new.preview", { path }))}:`;

	// Confirm with user to proceed with file creation
	const proceed = await confirm({
		message: t("new.step.confirm"),
		initialValue: true
	});

	// Exit if user cancels or chooses not to proceed
	(isCancel(proceed) || !proceed) && (cancel(CANCEL_MESSAGE), process.exit(0));

	// Check if file already exists and prompt for confirmation to overwrite
	if (existsSync(path)) {
		const overwrite = await confirm({
			message: t("new.step.overwrite", { path })
		});

		// Exit if user cancels or chooses not to overwrite
		(isCancel(overwrite) || !overwrite) && (cancel(CANCEL_MESSAGE), process.exit(0));
	}

	// Create parent directories if they don't exist
	mkdirSync(dirname(path), { recursive: true });

	// Write the file to disk
	const waiting = spinner();
	waiting.start(t("new.creating"));

	writeFileSync(path, content, "utf-8");
	waiting.stop(`✅ ${t("new.created")}`);

	// Ask if user wants to open the file in VS Code
	const openInVSCode = await confirm({
		message: `🖥️ ${t("new.open.message")}`,
		initialValue: true
	});

	// Open file in VS Code if confirmed
	if (!isCancel(openInVSCode) && openInVSCode) {
		const { exec } = await import("node:child_process");
		exec(`code "${path}"`, error => error && log.error(`${t("new.open.error")}: ${error.message}`));
	}

	outro(`🎉 ${t("new.done")}`);
})().catch(error => {
	// Handle any errors that occur during execution
	log.error(`${t("new.error")}:`);
	log.error(error);
	process.exit(1);
});

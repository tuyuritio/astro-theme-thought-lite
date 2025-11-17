// Import ShikiTransformer type for syntax highlighting transformations
import type { ShikiTransformer } from "shiki";
import { h } from "hastscript";

/**
 * Creates a Shiki transformer that adds copy-to-clipboard functionality to code blocks
 * @param options - Configuration object
 * @param options.duration - Duration in milliseconds for the "copied" state visual feedback
 * @returns ShikiTransformer that injects copy button into code blocks
 */
const copy: (options: { duration: number }) => ShikiTransformer = ({ duration }) => ({
	name: "code-copy-button",
	// Transform the pre element by adding a copy button and wrapping it in a container
	root(node): void {
		// Wrap the existing code block
		const wrapper = h("div.code-container", [node.children[0]]);

		// Append the copy button element
		wrapper.children.push({
			type: "element",
			tagName: "button",
			properties: {
				type: "button",
				data: this.source, // Store the source code in data attribute
				class: "code-copy-button",
				"aria-hidden": true,
				// Inline click handler: copies code to clipboard and shows visual feedback
				onclick: `navigator.clipboard.writeText(this.attributes.data.value);this.classList.add("code-copied");window.setTimeout(() => this.classList.remove("code-copied"), ${duration})`
			},
			children: [
				// Copy icon (clipboard icon) - shown by default
				{
					type: "element",
					tagName: "svg",
					properties: {
						version: "1.1",
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 16 16",
						class: "copy-icon"
					},
					children: [
						{
							type: "element",
							tagName: "path",
							properties: {
								d: "M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"
							},
							children: []
						},
						{
							type: "element",
							tagName: "path",
							properties: {
								d: "M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"
							},
							children: []
						}
					]
				},
				// Checkmark icon - shown when code is successfully copied
				{
					type: "element",
					tagName: "svg",
					properties: {
						version: "1.1",
						xmlns: "http://www.w3.org/2000/svg",
						viewBox: "0 0 16 16",
						class: "done-icon"
					},
					children: [
						{
							type: "element",
							tagName: "path",
							properties: {
								d: "M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"
							},
							children: []
						}
					]
				}
			]
		});

		// Replace the original node's children with the new wrapper
		node.children = [wrapper];
	}
});

export default copy;

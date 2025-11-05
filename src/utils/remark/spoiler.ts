import { visit } from "unist-util-visit";
import type { Visitor, VisitorResult } from "unist-util-visit";
import type { Plugin, Transformer } from "unified";
import type { Data, Parent, PhrasingContent, Root, Text } from "mdast";
import { findAllBetween } from "unist-util-find-between-all";
import { findAllBefore } from "unist-util-find-all-before";
import { findAllAfter } from "unist-util-find-all-after";
import { findAfter } from "unist-util-find-after";
import { u } from "unist-builder";

interface SpoilerData extends Data {}

interface Spoiler extends Parent {
	type: "spoiler";
	children: PhrasingContent[];
	data?: SpoilerData | undefined;
}

declare module "mdast" {
	interface PhrasingContentMap {
		spoiler: Spoiler;
	}

	interface RootContentMap {
		spoiler: Spoiler;
	}
}

// Regex patterns for spoiler syntax !!content!!
export const REGEX = /!!(?![\s!])([\s\S]*?)(?<![\s!])!!/;
export const REGEX_GLOBAL = /!!(?![\s!])([\s\S]*?)(?<![\s!])!!/g;

export const REGEX_STARTING = /!!(?![\s]|!!+\s)/;
export const REGEX_STARTING_GLOBAL = /!!(?![\s]|!!+\s)/g;

export const REGEX_ENDING = /(?<!\s|\s!|\s!)!!/;
export const REGEX_ENDING_GLOBAL = /(?<!\s|\s!|\s!)!!/g;

/**
 * Remark plugin that turns !!text!! into <span class="spoiler">text</span>
 *
 * Examples:
 * - !!spoiler text!! -> <span class="spoiler">spoiler text</span>
 * - !!**bold spoiler**!! -> <span class="spoiler"><strong>bold spoiler</strong></span>
 * - !!*italic spoiler*!! -> <span class="spoiler"><em>italic spoiler</em></span>
 *
 * Note: Empty spoiler markers (!! !!) are left unchanged
 */
export const plugin: Plugin<undefined[], Root> = () => {
	/**
	 * Constructs a custom spoiler node
	 */
	const constructSpoilerNode = (children: PhrasingContent[]): Spoiler => {
		return {
			type: "spoiler",
			children,
			data: {
				hName: "span",
				hProperties: {
					className: ["spoiler"]
				}
			}
		};
	};

	/**
	 * Visits Text nodes to match simple spoiler syntax (!!spoiler text!!)
	 */
	const visitorSimple: Visitor<Text, Parent> = (node, index, parent): VisitorResult => {
		if (!parent || typeof index === "undefined") return;

		if (!REGEX.test(node.value)) return;

		const children: Array<PhrasingContent> = [];
		const value = node.value;
		let tempValue = "";
		let prevMatchIndex = 0;
		let prevMatchLength = 0;

		const matches = Array.from(value.matchAll(REGEX_GLOBAL));

		for (let matchIndex = 0; matchIndex < matches.length; matchIndex++) {
			const match = matches[matchIndex];

			const [matched, spoilerText] = match;
			const mIndex = match.index!;
			const mLength = matched.length;

			// Text part before each matched part
			const textPartIndex = prevMatchIndex + prevMatchLength;

			prevMatchIndex = mIndex;
			prevMatchLength = mLength;

			// If there is text before the spoiler
			if (mIndex > textPartIndex) {
				const textValue = value.substring(textPartIndex, mIndex);
				const textNode = u("text", textValue);
				children.push(textNode);
			}

			const spoilerNode = constructSpoilerNode([{ type: "text", value: spoilerText.trim() }]);
			children.push(spoilerNode);

			// Control for the last text node if exists after the last match
			tempValue = value.slice(mIndex + mLength);
		}

		// If there is still text after the last match
		if (tempValue) {
			const textNode = u("text", tempValue);
			children.push(textNode);
		}

		if (children.length) parent.children.splice(index, 1, ...children);
	};

	/**
	 * Visits Text nodes to find complex spoiler syntax (!!**bold spoiler**!!)
	 * when parent contains other content phrases
	 */
	const visitorComplex: Visitor<Text, Parent> = (node, index, parent): VisitorResult => {
		if (!parent || typeof index === "undefined") return;

		// Check if the Text node matches with "starting spoiler regex"
		if (!REGEX_STARTING.test(node.value)) return;

		const openingNode = node;

		// Find any next child Text node of the parent that has "ending spoiler regex"
		const closingNode = findAfter(parent, openingNode, node => node.type === "text" && REGEX_ENDING.test((node as Text).value));

		if (!closingNode) return;

		// Now we're sure that the parent has a spoiler element between opening and closing Text nodes
		const beforeChildren = findAllBefore(parent, openingNode) as PhrasingContent[];
		const mainChildren = findAllBetween(parent, openingNode, closingNode) as PhrasingContent[];
		const afterChildren = findAllAfter(parent, closingNode) as PhrasingContent[];

		/********************* OPENING NODE ***********************/
		const value = openingNode.value;
		const match = Array.from(value.matchAll(REGEX_STARTING_GLOBAL))[0];
		const [matched] = match;
		const mLength = matched.length;
		const mIndex = match.index!;

		// If there is text before the spoiler marker
		if (mIndex > 0) {
			const textValue = value.substring(0, mIndex);
			const textNode = u("text", textValue);
			beforeChildren.push(textNode);
		}

		// If there is text after the spoiler marker
		if (value.length > mIndex + mLength) {
			const textValue = value.slice(mIndex + mLength);
			const textNode = u("text", textValue);
			mainChildren.unshift(textNode);
		}

		/********************* CLOSING NODE ***********************/
		const closingValue = (closingNode as Text).value;
		const closingMatch = Array.from(closingValue.matchAll(REGEX_ENDING_GLOBAL))[0];
		const [closingMatched] = closingMatch;
		const closingLength = closingMatched.length;
		const closingIndex = closingMatch.index!;

		// If there is text before the closing marker
		if (closingIndex > 0) {
			const textValue = closingValue.substring(0, closingIndex);
			const textNode = u("text", textValue);
			mainChildren.push(textNode);
		}

		// If there is text after the closing marker
		if (closingValue.length > closingIndex + closingLength) {
			const textValue = closingValue.slice(closingIndex + closingLength);
			const textNode = u("text", textValue);
			afterChildren.unshift(textNode);
		}

		// Construct the spoiler node
		const spoilerNode = constructSpoilerNode(mainChildren);

		parent.children = [...beforeChildren, spoilerNode, ...afterChildren];

		return index; // Re-visit the same node and children
	};

	const transformer: Transformer<Root> = tree => {
		// Find simple spoiler syntax in Text nodes
		visit(tree, "text", visitorSimple);

		// Find complex spoiler syntax when parent contains other content phrases
		visit(tree, "text", visitorComplex);
	};

	return transformer;
};

export default plugin;

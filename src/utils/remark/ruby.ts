import type { Plugin, Transformer } from "unified";
import type { Parent } from "unist";
import { u } from "unist-builder";
import type { Data, PhrasingContent, Root } from "mdast";
import { findAndReplace } from "mdast-util-find-and-replace";

/**
 * Data for ruby parenthesis (rp) element.
 */
interface RubyParenthesisData extends Data {
	hName: "rp";
}

/**
 * Ruby parenthesis (rp) element.
 */
interface RubyParenthesis extends Parent {
	type: "rp";
	children: PhrasingContent[];
	data?: RubyParenthesisData;
}

/**
 * Data for ruby text (rt) element.
 */
interface RubyTextData extends Data {
	hName: "rt";
}

/**
 * Ruby text (rt) element.
 */
interface RubyText extends Parent {
	type: "rt";
	children: PhrasingContent[];
	data?: RubyTextData;
}

/**
 * Data for ruby element.
 */
interface RubyData extends Data {
	hName: "ruby";
}

/**
 * Ruby element.
 */
interface Ruby extends Parent {
	type: "ruby";
	children: PhrasingContent[];
	data?: RubyData;
}

declare module "mdast" {
	interface PhrasingContentMap {
		ruby: Ruby;
		rp: RubyParenthesis;
		rt: RubyText;
	}

	interface RootContentMap {
		ruby: Ruby;
		rp: RubyParenthesis;
		rt: RubyText;
	}
}

/**
 * Regex to match the ruby syntax: {base}(reading)
 */
const REGEX_RUBY = /\{([^{}]+?)\}\(([^()]+?)\)/g;

/**
 * Remark plugin to convert {base}(reading) syntax to <ruby> HAST node tree.
 *
 * Syntax examples:
 * - {漢字}(かんじ) -> <ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby>
 * - {漢字}(かん|じ) -> Character-by-character ruby (when the number of separators matches the number of base characters)
 */
const remarkRuby: Plugin<[], Root> = () => {
	const transformer: Transformer<Root> = tree => {
		findAndReplace(tree, [
			REGEX_RUBY,
			(_, base: string, ruby: string) => {
				const bases = Array.from(base);
				const readings = ruby.split("|");

				const children: PhrasingContent[] = [];

				if (bases.length === readings.length) {
					// Character-by-character ruby mode
					bases.forEach((char, index) => {
						children.push(u("text", char));
						children.push({ type: "rp", children: [u("text", "(")], data: { hName: "rp" } });
						children.push({ type: "rt", children: [u("text", readings[index])], data: { hName: "rt" } });
						children.push({ type: "rp", children: [u("text", ")")], data: { hName: "rp" } });
					});
				} else {
					// Group ruby mode
					children.push(u("text", base));
					children.push({ type: "rp", children: [u("text", "(")], data: { hName: "rp" } });
					children.push({ type: "rt", children: [u("text", ruby)], data: { hName: "rt" } });
					children.push({ type: "rp", children: [u("text", ")")], data: { hName: "rp" } });
				}

				return { type: "ruby", children, data: { hName: "ruby" } };
			}
		]);
	};

	return transformer;
};

export default remarkRuby;

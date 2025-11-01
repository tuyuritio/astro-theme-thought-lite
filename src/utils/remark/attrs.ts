import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import type { Parent } from "unist";
import type { Root, Text } from "mdast";

/**
 * Regex pattern to match attribute blocks like `{...}` at the end or start of text.
 */
const ATTR_BLOCK_END_REGEX = /\s*(\{(?:[^"'}]+|"[^"]*"|'[^']*')*\})\s*$/;
const ATTR_BLOCK_START_REGEX = /^\s*(\{(?:[^"'}]+|"[^"]*"|'[^']*')*\})/;

/**
 * Parse attributes string like markdown-it-attrs
 * 
 * Syntax examples:
 * - {#id} → id="id"
 * - {.className} → class="className"
 * - {key=value} → key="value"
 * - {key="value with spaces"} → key="value with spaces"
 * - {#id .class1 .class2 attr=value} → id="id" class="class1 class2" attr="value"
 */
function parseAttributes(attrStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const classes: string[] = [];

  // Remove leading/trailing spaces and braces
  const content = attrStr.trim().replace(/^\{|\}$/g, "").trim();

  // Match patterns: #id, .class, key=value, key="value", key='value'
  const patterns = [
    // ID: #id
    /#([A-Za-z0-9\-_]+)/g,

    // Class: .className
    /\.([A-Za-z0-9\-_]+)/g,

    // Attribute with quoted value: key="value" or key='value'
    /([A-Za-z0-9\-_]+)=["']([^"']*)["']/g,

    // Attribute without quotes: key=value
    /([A-Za-z0-9\-_]+)=([A-Za-z0-9\-_]+)/g,
  ];

  let match;

  // Extract ID (only the last one if multiple)
  patterns[0].lastIndex = 0; // Reset regex
  while ((match = patterns[0].exec(content)) !== null) attrs.id = match[1];

  // Extract classes
  while ((match = patterns[1].exec(content)) !== null) classes.push(match[1]);

  // Extract quoted attributes
  patterns[2].lastIndex = 0;
  while ((match = patterns[2].exec(content)) !== null) {
    const key = match[1];
    const value = match[2];
    if (key !== "id" && key !== "class") {
      attrs[key] = value;
    }
  }

  // Extract unquoted attributes (avoid duplicates with quoted ones)
  patterns[3].lastIndex = 0;
  const existingKeys = new Set(Object.keys(attrs).filter(k => k !== "id" && k !== "class"));
  while ((match = patterns[3].exec(content)) !== null) {
    const key = match[1];
    const value = match[2];
    if (key !== "id" && key !== "class" && !existingKeys.has(key)) {
      attrs[key] = value;
    }
  }

  // Add classes if any
  if (classes.length > 0) attrs.class = classes.join(" ");

  return attrs;
}

/**
 * Apply attributes to a node
 */
function applyAttributes(node: any, attrs: Record<string, string>) {
  node.data = node.data || {};
  node.data.hProperties = node.data.hProperties || {};

  // Merge attributes
  Object.assign(node.data.hProperties, attrs);

  // Also set id in data.id for compatibility
  if (attrs.id) node.data.id = attrs.id;
}

/**
 * Remark plugin to parse custom attributes on inline elements and headings
 * 
 * Syntax examples:
 * - Headings: ## Heading {#custom-id .class}
 * - Links: [text](url){target=_blank .external}
 * - Images: ![alt](img.png){.responsive width=500}
 * - Inline elements: **bold**{.red} or `code`{.language-js}
 */
const remarkAttrs: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, (node, index, parent: Parent | undefined) => {
      const elements = [
        "heading",
        "image",
        "link",
        "strong",
        "emphasis",
        "inlineCode",
      ];

      // Process nodes that have text children or value property
      if (!elements.includes(node.type)) return;

      // Handle nodes with children (heading, link, strong, emphasis, inlineCode)
      if ("children" in node && node.children && Array.isArray(node.children) && node.children.length > 0) {
        const lastChild = node.children[node.children.length - 1];

        if (lastChild.type === "text" && typeof lastChild.value === "string") {
          // Extract attributes from the end of text: {...}
          const match = lastChild.value.match(ATTR_BLOCK_END_REGEX);

          if (match) {
            const attrs = parseAttributes(match[1]);

            // Check if we actually parsed any attributes
            if (Object.keys(attrs).length > 0) {
              // Remove the attribute string from text
              const remainingText = lastChild.value.substring(0, match.index);

              // Update or remove the text node
              if (remainingText.trim() === "") {
                node.children.pop();
              } else {
                lastChild.value = remainingText;
              }

              // Apply attributes to the parent node
              applyAttributes(node, attrs);
            }
          }
        }
      }

      // Handle inline elements (link, strong, emphasis, inlineCode) followed by attribute text
      if (parent && typeof index === "number" && elements.includes(node.type)) {
        const nextSibling = parent.children[index + 1];
        if (nextSibling && nextSibling.type === "text") {
          const textNode = nextSibling as Text;
          // Check if the text starts with attributes
          const match = textNode.value.match(ATTR_BLOCK_START_REGEX);
          if (match) {
            const attrs = parseAttributes(match[1]);

            if (Object.keys(attrs).length > 0) {
              // Remove the attribute string from the text node
              const remainingText = textNode.value.substring(match[0].length);

              if (remainingText.trim() === "") {
                // Remove the text node if it's empty
                parent.children.splice(index + 1, 1);
              } else {
                textNode.value = remainingText;
              }

              // Apply attributes to the inline element
              applyAttributes(node, attrs);
            }
          }
        }
      }

      // Handle image nodes (they have properties but not children)
      if (node.type === "image" && parent && typeof index === "number") {
        // Check if there's a text node after the image in the parent
        const nextSibling = parent.children[index + 1];
        if (nextSibling && nextSibling.type === "text") {
          const textNode = nextSibling as Text;
          // Check if the text starts with attributes
          const match = textNode.value.match(ATTR_BLOCK_START_REGEX);
          if (match) {
            const attrs = parseAttributes(match[1]);

            if (Object.keys(attrs).length > 0) {
              // Remove the attribute string from the text node
              const remainingText = textNode.value.substring(match[0].length);

              if (remainingText.trim() === "") {
                // Remove the text node if it's empty
                parent.children.splice(index + 1, 1);
              } else {
                textNode.value = remainingText;
              }

              // Apply attributes to the image
              applyAttributes(node, attrs);
            }
          }
        }
      }
    });
  };
}

export default remarkAttrs;
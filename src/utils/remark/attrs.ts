import { visit } from "unist-util-visit";

/*
 * Remark plugin: parse custom attributes on heading text and attach id to heading
 * Supports ASCII word-like ids: letters, digits, hyphen and underscore inside quotes.
 * 
 * Syntax:
 * ## Heading text {id: "some-id"}
 * or
 * ## Heading text {id: 'some-id'}
 * Example:
 * ## Heading text {id: "custom-id"}
 * 
 * This will convert the heading to have id="custom-id" in the resulting HTML.
 * 
 * Note: This plugin only processes headings. It can be extended to handle other elements if needed.
 */
export default function remarkAttrs() {
  return (tree: any) => {
    visit(tree, "heading", (node: any) => {
      const children = node.children;
      if (!children || children.length === 0) return;
      const last = children[children.length - 1];
      if (last && last.type === "text" && typeof last.value === "string") {
        // match {id: "some-id"} or {id: 'some-id'} with optional spaces
        const m = last.value.match(/\s*\{\s*id\s*:\s*["']([A-Za-z0-9\-_]+)["']\s*\}\s*$/);
        if (m) {
          const id = m[1];
          // remove the {id: "..."} from the text node
          last.value = last.value.replace(/\s*\{\s*id\s*:\s*["']([A-Za-z0-9\-_]+)["']\s*\}\s*$/, "");
          // if text node became empty, remove it
          if (last.value === "") {
            children.pop();
          }

          node.data = node.data || {};
          // rehype-friendly properties
          node.data.hProperties = node.data.hProperties || {};
          node.data.hProperties.id = id;
          // some plugins read data.id
          node.data.id = id;
        }
      }
    });
  };
}

/**
 * Extract excerpt from markdown content
 * Takes the last N characters from the markdown content (excluding frontmatter)
 *
 * @param content - Raw markdown content string
 * @param length - Maximum number of characters to extract (default: 150)
 * @returns Excerpt string with ellipsis if truncated
 */
export function extractExcerpt(content: string, length: number = 150): string {
  // Handle undefined or null content
  if (!content) return '';

  // Remove frontmatter if present
  let cleaned = content.replace(/^---[\s\S]*?---\s*/m, '');

  // Remove footnote definitions (e.g., [^1]: footnote text)
  cleaned = cleaned.replace(/^\[\^[^\]]+\]:\s+.+$/gm, '');

  // Remove complete heading lines (including the entire line)
  cleaned = cleaned.replace(/^#+\s+.+$/gm, '');

  // Remove footnote references (e.g., [^1])
  cleaned = cleaned.replace(/\[\^[^\]]+\]/g, '');

  // Remove markdown links but keep the text (e.g., [text](url) -> text)
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove reference-style links (e.g., [text][ref] -> text)
  cleaned = cleaned.replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1');

  // Remove link definitions (e.g., [ref]: url "title")
  cleaned = cleaned.replace(/^\[[^\]]+\]:\s+.+$/gm, '');

  // Remove images (e.g., ![alt](url))
  cleaned = cleaned.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');

  // Remove all HTML tags (both paired and self-closing)
  cleaned = cleaned.replace(/<[^>]+>/g, '');

  // Trim whitespace
  const trimmed = cleaned.trim();

  // If content is empty, return empty string
  if (!trimmed) return '';

  // Take the last N characters
  // Find a good starting point (preferably after a space or punctuation)
  let startIndex = Math.max(0, trimmed.length - length);

  // If we're not starting from the beginning, try to start at a word boundary
  if (startIndex > 0) {
    // Look for the next space or newline after startIndex
    const nextSpace = trimmed.indexOf(' ', startIndex);
    const nextNewline = trimmed.indexOf('\n', startIndex);

    // Use the first boundary we find (or keep startIndex if none found within reasonable distance)
    const boundaries = [nextSpace, nextNewline].filter(i => i !== -1 && i < startIndex + 50);
    if (boundaries.length > 0) {
      startIndex = Math.min(...boundaries) + 1;
    }
  }

  // Extract the excerpt
  let excerpt = trimmed.substring(startIndex);

  // Remove remaining markdown formatting for cleaner display
  excerpt = excerpt
    .replace(/\*\*(.+?)\*\*/g, '$1')  // Remove bold
    .replace(/\*(.+?)\*/g, '$1')      // Remove italic
    .replace(/__(.+?)__/g, '$1')      // Remove bold (underscore)
    .replace(/_(.+?)_/g, '$1')        // Remove italic (underscore)
    .replace(/`(.+?)`/g, '$1')        // Remove inline code
    .replace(/^[-*+]\s+/gm, '')       // Remove list markers
    .replace(/^\d+\.\s+/gm, '')       // Remove numbered list markers
    .replace(/^>\s+/gm, '')           // Remove blockquotes
    .replace(/~~(.+?)~~/g, '$1')      // Remove strikethrough
    .replace(/\n+/g, ' ↩ ')           // Replace newlines with line-break symbol
    .replace(/\s+/g, ' ')             // Normalize whitespace
    .trim();

  // If we truncated from the start, add ellipsis
  if (startIndex > 0) {
    excerpt = '...' + excerpt;
  }

  // Limit to exact length and add trailing ellipsis if needed
  if (excerpt.length > length) {
    excerpt = excerpt.substring(0, length - 3) + '...';
  }

  return excerpt;
}

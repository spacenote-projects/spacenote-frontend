import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkHtml from "remark-html"
import rehypeSanitize from "rehype-sanitize"
import { rehype } from "rehype"

const markdownProcessor = remark().use(remarkGfm).use(remarkHtml, { sanitize: false })

const sanitizer = rehype().use(rehypeSanitize)

export async function markdownToHtml(markdown: string): Promise<string> {
  if (!markdown) return ""

  try {
    const result = await markdownProcessor.process(markdown)
    return String(result)
  } catch (error) {
    console.error("Markdown processing error:", error)
    return markdown
  }
}

export async function markdownToHtmlSafe(markdown: string): Promise<string> {
  if (!markdown) return ""

  try {
    const html = await markdownToHtml(markdown)
    const sanitized = await sanitizer.process(html)
    return String(sanitized)
  } catch (error) {
    console.error("Markdown processing error:", error)
    return markdown
  }
}

export function markdownToHtmlSync(markdown: string): string {
  if (!markdown) return ""

  try {
    const result = markdownProcessor.processSync(markdown)
    return String(result)
  } catch (error) {
    console.error("Markdown processing error:", error)
    return markdown
  }
}

export function markdownToHtmlSafeSync(markdown: string): string {
  if (!markdown) return ""

  try {
    const html = markdownToHtmlSync(markdown)
    const sanitized = sanitizer.processSync(html)
    return String(sanitized)
  } catch (error) {
    console.error("Markdown processing error:", error)
    return markdown
  }
}

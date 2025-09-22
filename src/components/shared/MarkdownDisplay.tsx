import { useEffect, useState } from "react"
import { markdownToHtmlSafe } from "@/lib/markdown"
import { cn } from "@/lib/utils"

interface MarkdownDisplayProps {
  content: string
  className?: string
}

export default function MarkdownDisplay({ content, className }: MarkdownDisplayProps) {
  const [html, setHtml] = useState<string>("")

  useEffect(() => {
    void markdownToHtmlSafe(content).then(setHtml)
  }, [content])

  if (!html) return null

  // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
  return <div className={cn("prose prose-sm max-w-none", className)} dangerouslySetInnerHTML={{ __html: html }} />
}

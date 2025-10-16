import { useEffect, useState } from "react"
import { httpClient } from "@/lib/http-client"

export function TextViewer({ slug, attachmentNumber }: { slug: string; attachmentNumber: number }) {
  const [textContent, setTextContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadText = async () => {
      try {
        setIsLoading(true)
        setError(null)
        setTextContent(null)

        const text = await httpClient.get(`api/v1/spaces/${slug}/attachments/${String(attachmentNumber)}`).text()

        if (!cancelled) {
          setTextContent(text)
          setIsLoading(false)
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load text content")
          setIsLoading(false)
        }
      }
    }

    void loadText()

    return () => {
      cancelled = true
    }
  }, [slug, attachmentNumber])

  return (
    <div className="w-full h-[70vh] border rounded bg-white overflow-auto">
      {isLoading && <div className="p-4 text-muted-foreground">Loading...</div>}
      {error && <div className="p-4 text-red-500">{error}</div>}
      {textContent && <pre className="p-4 text-sm font-mono whitespace-pre">{textContent}</pre>}
    </div>
  )
}

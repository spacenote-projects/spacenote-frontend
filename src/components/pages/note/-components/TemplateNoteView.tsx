import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router"
import type { Note, Space } from "@/types"
import { renderNoteDetailTemplate } from "@/lib/template"
import { buildFieldFilterQuery } from "@/lib/field-filters"
import { DefaultNoteView } from "./DefaultNoteView"
import { cache } from "@/hooks/useCache"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TemplateNoteViewProps {
  note: Note
  space: Space
}

export function TemplateNoteView({ note, space }: TemplateNoteViewProps) {
  const [renderedHtml, setRenderedHtml] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const users = cache.useUsers()

  useEffect(() => {
    async function render() {
      if (!space.templates.note_detail) {
        setError("No template defined")
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      const result = await renderNoteDetailTemplate(space.templates.note_detail, {
        note,
        space,
        users,
      })

      if (result.error) {
        setError(result.error)
      } else {
        setRenderedHtml(result.html)
      }
      setIsLoading(false)
    }

    void render()
  }, [note, space, users])

  if (error) {
    return (
      <>
        <Alert className="mb-4">
          <AlertDescription>Template rendering error: {error}</AlertDescription>
        </Alert>
        <DefaultNoteView note={note} space={space} />
      </>
    )
  }

  if (isLoading) {
    return <div>Loading template...</div>
  }

  const handleClick = (e: React.MouseEvent) => {
    // Check if clicked on a field filter element (user, select, etc.)
    const fieldElement = (e.target as HTMLElement).closest("[data-field-id]")
    if (fieldElement) {
      e.preventDefault()
      e.stopPropagation()
      const fieldId = fieldElement.getAttribute("data-field-id")
      const fieldType = fieldElement.getAttribute("data-field-type")
      const fieldValue = fieldElement.getAttribute("data-field-value")

      if (fieldId && fieldType && fieldValue) {
        const query = buildFieldFilterQuery(fieldId, fieldType, fieldValue)
        if (!query) return

        const params = new URLSearchParams()
        params.set("q", query)

        // Preserve current filter if exists
        const currentFilter = searchParams.get("filter")
        if (currentFilter) {
          params.set("filter", currentFilter)
        }

        void navigate(`/s/${space.slug}?${params}`)
      }
      return
    }

    // Check if clicked on a link
    const link = (e.target as HTMLElement).closest("a")
    if (!link) return

    const href = link.getAttribute("href")
    if (!href) return

    // Allow external links and special clicks (Ctrl/Cmd/Shift/middle click)
    if (href.startsWith("http") || e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) {
      return // Let browser handle it
    }

    // For internal links, use React Router
    if (href.startsWith("/")) {
      e.preventDefault()
      void navigate(href)
    }
  }

  // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
  return <div className="prose prose-sm max-w-none" onClick={handleClick} dangerouslySetInnerHTML={{ __html: renderedHtml }} />
}

import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import type { Note, Space } from "@/types"
import { renderNoteListTemplate } from "@/lib/template"
import { cache } from "@/hooks/useCache"

export function TemplateNotesView({ notes, space }: { notes: Note[]; space: Space }) {
  const [renderedHtml, setRenderedHtml] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const users = cache.useUsers()

  useEffect(() => {
    async function render() {
      if (!space.templates.note_list) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      const result = await renderNoteListTemplate(space.templates.note_list, {
        notes,
        space,
        users,
      })

      setRenderedHtml(result.html)
      setIsLoading(false)
    }

    void render()
  }, [notes, space, users])

  if (isLoading) {
    return <div>Loading template...</div>
  }

  const handleClick = (e: React.MouseEvent) => {
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

import { useState, useEffect } from "react"
import type { Note, Space } from "@/types"
import { renderTemplate } from "@/lib/template"
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

      const result = await renderTemplate(space.templates.note_detail, {
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

  // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
  return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
}

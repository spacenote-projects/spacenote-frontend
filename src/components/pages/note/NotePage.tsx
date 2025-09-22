import { useParams, useNavigate } from "react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"
import { api } from "@/lib/api"
import { cache } from "@/hooks/useCache"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"
import { Button } from "@/components/ui/button"
import { CommentForm } from "./-components/CommentForm"
import { CommentList } from "./-components/CommentList"
import { DefaultNoteView } from "./-components/DefaultNoteView"
import { TemplateNoteView } from "./-components/TemplateNoteView"

export default function NotePage() {
  const { slug, number } = useParams() as { slug: string; number: string }
  const navigate = useNavigate()
  const space = cache.useSpace(slug)
  const { data: note } = useSuspenseQuery(api.queries.spaceNote(slug, Number(number)))

  const hasTemplate = Boolean(space.templates.note_detail)
  const NoteView = hasTemplate ? TemplateNoteView : DefaultNoteView

  return (
    <div className="container mx-auto px-4 py-8">
      <SpacePageHeader
        space={space}
        section={`Note #${String(note.number)}`}
        actions={<Button onClick={() => navigate(`/s/${slug}/${number}/edit`)}>Edit</Button>}
      />

      <NoteView note={note} space={space} />

      <div className="mt-8 space-y-6">
        <h2 className="text-xl font-semibold">Comments</h2>

        <div className="border rounded-lg p-4">
          <CommentForm slug={slug} noteNumber={Number(number)} />
        </div>

        <Suspense fallback={<div>Loading comments...</div>}>
          <CommentList slug={slug} noteNumber={Number(number)} />
        </Suspense>
      </div>
    </div>
  )
}

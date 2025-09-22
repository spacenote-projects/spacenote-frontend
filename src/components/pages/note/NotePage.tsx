import { useParams, useNavigate } from "react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"
import { api } from "@/lib/api"
import { cache } from "@/hooks/useCache"
import NoteFieldValue from "@/components/shared/NoteFieldValue"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"
import { Button } from "@/components/ui/button"
import { CommentForm } from "./-components/CommentForm"
import { CommentList } from "./-components/CommentList"

export default function NotePage() {
  const { slug, number } = useParams() as { slug: string; number: string }
  const navigate = useNavigate()
  const space = cache.useSpace(slug)
  const { data: note } = useSuspenseQuery(api.queries.spaceNote(slug, Number(number)))

  return (
    <div className="container mx-auto px-4 py-8">
      <SpacePageHeader
        space={space}
        section={`Note #${String(note.number)}`}
        actions={<Button onClick={() => navigate(`/s/${slug}/${number}/edit`)}>Edit</Button>}
      />

      <div className="space-y-3">
        {space.fields.map((field) => (
          <div key={field.id} className="flex gap-4">
            <div className="font-medium min-w-32">{field.id}</div>
            <div className="text-sm">
              <NoteFieldValue note={note} fieldKey={field.id} field={field} />
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <div className="font-medium min-w-32">Created</div>
          <div className="text-sm">
            <NoteFieldValue note={note} fieldKey="created_at" />
            {" by "}
            <NoteFieldValue note={note} fieldKey="user_id" />
          </div>
        </div>

        {note.edited_at && (
          <div className="flex gap-4">
            <div className="font-medium min-w-32">Edited</div>
            <div className="text-sm">
              <NoteFieldValue note={note} fieldKey="edited_at" />
            </div>
          </div>
        )}
      </div>

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

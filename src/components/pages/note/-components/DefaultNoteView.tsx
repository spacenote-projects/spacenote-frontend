import type { Note, Space } from "@/types"
import NoteFieldValue from "@/components/shared/NoteFieldValue"

interface DefaultNoteViewProps {
  note: Note
  space: Space
}

export function DefaultNoteView({ note, space }: DefaultNoteViewProps) {
  return (
    <div className="space-y-3">
      {space.fields.map((field) => (
        <div key={field.id} className="flex gap-4">
          <div className="font-medium min-w-32">{field.id}</div>
          <div className="text-sm">
            <NoteFieldValue note={note} fieldKey={field.id} field={field} spaceSlug={space.slug} />
          </div>
        </div>
      ))}

      <div className="flex gap-4">
        <div className="font-medium min-w-32">Created</div>
        <div className="text-sm">
          <NoteFieldValue note={note} fieldKey="created_at" />
          {" by "}
          <NoteFieldValue note={note} fieldKey="user_id" spaceSlug={space.slug} />
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
  )
}

import type { Note, Space } from "@/types"

interface JSONNoteViewProps {
  note: Note
  space: Space
}

export function JSONNoteView({ note }: JSONNoteViewProps) {
  return (
    <div className="mt-6">
      <pre className="bg-muted rounded-lg p-4 overflow-auto text-sm">
        <code>{JSON.stringify(note, null, 2)}</code>
      </pre>
    </div>
  )
}

import type { Note, Space } from "@/types"

interface JSONNotesViewProps {
  notes: Note[]
  space: Space
  filter?: string
}

export function JSONNotesView({ notes }: JSONNotesViewProps) {
  return (
    <div className="mt-6">
      <pre className="bg-muted rounded-lg p-4 overflow-auto text-sm">
        <code>{JSON.stringify(notes, null, 2)}</code>
      </pre>
    </div>
  )
}

import { useParams } from "react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useSpace } from "@/hooks/useCache"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import NoteFieldValue from "@/components/shared/NoteFieldValue"

export default function NotesPage() {
  const { slug } = useParams() as { slug: string }
  const space = useSpace(slug)
  const { data: notes } = useSuspenseQuery(api.queries.spaceNotes(slug))

  // Determine columns to display
  const columns = space.list_fields.length > 0 ? space.list_fields : ["number", "created_at", "author"]
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{space.title}</h1>
        <p className="text-muted-foreground">All notes in this space</p>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No notes yet in this space</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {notes.map((note) => (
              <TableRow key={note.id}>
                {columns.map((column) => (
                  <TableCell key={column}>
                    <NoteFieldValue note={note} fieldKey={column} field={space.fields.find((f) => f.name === column)} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

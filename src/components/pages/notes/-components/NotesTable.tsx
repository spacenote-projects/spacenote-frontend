import { useNavigate } from "react-router"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import NoteFieldValue from "@/components/shared/NoteFieldValue"
import type { Note, Space } from "@/types"

export function NotesTable({ notes, columns, space, slug }: { notes: Note[]; columns: string[]; space: Space; slug: string }) {
  const navigate = useNavigate()

  return (
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
          <TableRow
            key={note.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => {
              void navigate(`/s/${slug}/${String(note.number)}`)
            }}
          >
            {columns.map((column) => (
              <TableCell key={column}>
                <NoteFieldValue note={note} fieldKey={column} field={space.fields.find((f) => f.id === column)} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

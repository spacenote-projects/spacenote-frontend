import { useNavigate } from "react-router"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import NoteFieldValue from "@/components/shared/NoteFieldValue"
import type { Note, Space } from "@/types"

/**
 * Determines which columns should be displayed in the notes table based on the active filter.
 *
 * @param space - The current space containing filter definitions and default list fields
 * @param filterName - Optional name of the active filter
 * @returns Array of field names to display as columns
 *
 * Priority order:
 * 1. If a filter is active and has list_fields defined, use those
 * 2. Otherwise use the space's default list_fields
 * 3. If neither exist, fall back to default columns: number, created_at, author
 */
function getFilterColumns(space: Space, filterName?: string): string[] {
  const activeFilter = filterName ? space.filters.find((f) => f.id === filterName) : undefined

  return activeFilter?.list_fields && activeFilter.list_fields.length > 0
    ? activeFilter.list_fields
    : space.list_fields.length > 0
      ? space.list_fields
      : ["number", "created_at", "user_id"]
}

export function DefaultNotesView({ notes, space, filter }: { notes: Note[]; space: Space; filter?: string }) {
  const navigate = useNavigate()
  const columns = getFilterColumns(space, filter)

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
              void navigate(`/s/${space.slug}/${String(note.number)}`)
            }}
          >
            {columns.map((column) => (
              <TableCell key={column}>
                <NoteFieldValue
                  note={note}
                  fieldKey={column}
                  field={space.fields.find((f) => f.id === column)}
                  spaceSlug={space.slug}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

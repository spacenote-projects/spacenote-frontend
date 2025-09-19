import type { Note, SpaceField } from "@/types"
import { formatDateTime, formatFieldValue } from "@/lib/formatters"
import { cache } from "@/hooks/useCache"
import MarkdownDisplay from "@/components/shared/MarkdownDisplay"

interface NoteFieldValueProps {
  note: Note
  fieldKey: string
  field?: SpaceField
}

function AuthorField({ authorId }: { authorId: string }) {
  try {
    const author = cache.useUser(authorId)
    return <>{author.username}</>
  } catch {
    return <>Unknown</>
  }
}

/**
 * Component for displaying a note field value with appropriate formatting
 */
export default function NoteFieldValue({ note, fieldKey, field }: NoteFieldValueProps) {
  // Handle special built-in fields
  switch (fieldKey) {
    case "number":
      return <>{note.number}</>
    case "created_at":
      return <>{formatDateTime(note.created_at)}</>
    case "author":
      return <AuthorField authorId={note.author_id} />
    default: {
      // Custom field value
      const value = note.fields[fieldKey]

      // Special handling for markdown fields
      if (field?.type === "markdown" && typeof value === "string") {
        return <MarkdownDisplay content={value} />
      }

      return <>{formatFieldValue(value, field?.type)}</>
    }
  }
}

import type { Note, SpaceField } from "@/types"
import { formatDateTime, formatFieldValue } from "@/lib/formatters"
import { cache } from "@/hooks/useCache"
import MarkdownDisplay from "@/components/shared/MarkdownDisplay"

interface NoteFieldValueProps {
  note: Note
  fieldKey: string
  field?: SpaceField
}

function UserField({ userId }: { userId: string }) {
  try {
    const user = cache.useUser(userId)
    return <>👤{user.username}</>
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
    case "edited_at":
      return <>{note.edited_at ? formatDateTime(note.edited_at) : "Never"}</>
    case "user_id":
      return <UserField userId={note.user_id} />
    default: {
      // Custom field value
      const value = note.fields[fieldKey]

      // Special handling for markdown fields
      if (field?.type === "markdown" && typeof value === "string") {
        return <MarkdownDisplay content={value} />
      }

      // Special handling for user fields
      if (field?.type === "user" && typeof value === "string") {
        return <UserField userId={value} />
      }

      return <>{formatFieldValue(value, field?.type)}</>
    }
  }
}

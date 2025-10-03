import { useNavigate, useSearchParams } from "react-router"
import type { Note, SpaceField } from "@/types"
import { formatDateTime, formatFieldValue } from "@/lib/formatters"
import { cache } from "@/hooks/useCache"
import MarkdownDisplay from "@/components/shared/MarkdownDisplay"
import { Badge } from "@/components/ui/badge"

interface NoteFieldValueProps {
  note: Note
  fieldKey: string
  field?: SpaceField
  spaceSlug?: string
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
export default function NoteFieldValue({ note, fieldKey, field, spaceSlug }: NoteFieldValueProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleTagClick = (tag: string) => {
    if (!spaceSlug) return
    const query = `tags:in:${encodeURIComponent(JSON.stringify([tag]))}`
    const params = new URLSearchParams()
    params.set("q", query)

    // Preserve current filter if exists
    const currentFilter = searchParams.get("filter")
    if (currentFilter) {
      params.set("filter", currentFilter)
    }

    void navigate(`/s/${spaceSlug}?${params}`)
  }

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

      // Special handling for tags fields - render as clickable badges
      if (field?.type === "tags" && Array.isArray(value) && spaceSlug) {
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
                onClick={(e) => {
                  e.stopPropagation()
                  handleTagClick(tag)
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )
      }

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

import { useNavigate, useSearchParams } from "react-router"
import type { Note, SpaceField, FieldType } from "@/types"
import { formatDateTime, formatFieldValue } from "@/lib/formatters"
import { buildFieldFilterQuery } from "@/lib/field-filters"
import { cache } from "@/hooks/useCache"
import MarkdownDisplay from "@/components/shared/MarkdownDisplay"
import { Badge } from "@/components/ui/badge"

interface NoteFieldValueProps {
  note: Note
  fieldKey: string
  field?: SpaceField
  spaceSlug?: string
}

function UserField({ userId, fieldKey, spaceSlug }: { userId: string; fieldKey?: string; spaceSlug?: string }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  try {
    const user = cache.useUser(userId)

    const handleClick = () => {
      if (!fieldKey || !spaceSlug) return

      const query = `${fieldKey}:eq:${encodeURIComponent(user.username)}`
      const params = new URLSearchParams()
      params.set("q", query)

      // Preserve current filter if exists
      const currentFilter = searchParams.get("filter")
      if (currentFilter) {
        params.set("filter", currentFilter)
      }

      void navigate(`/s/${spaceSlug}?${params}`)
    }

    if (fieldKey && spaceSlug) {
      return (
        <Badge
          variant="secondary"
          className="cursor-pointer hover:bg-secondary/80"
          onClick={(e) => {
            e.stopPropagation()
            handleClick()
          }}
        >
          👤{user.username}
        </Badge>
      )
    }
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

  /**
   * Generic click handler for filterable field values
   * Creates a query parameter based on field type and value
   */
  const handleFieldClick = (fieldId: string, fieldType: FieldType, value: string | string[]) => {
    if (!spaceSlug) return

    const query = buildFieldFilterQuery(fieldId, fieldType, value)
    if (!query) return

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
      return <UserField userId={note.user_id} fieldKey="user_id" spaceSlug={spaceSlug} />
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
                  handleFieldClick(fieldKey, "tags", tag)
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )
      }

      // Special handling for string_choice fields - render as clickable badge
      if (field?.type === "string_choice" && typeof value === "string" && spaceSlug) {
        return (
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-secondary/80"
            onClick={(e) => {
              e.stopPropagation()
              handleFieldClick(fieldKey, "string_choice", value)
            }}
          >
            {value}
          </Badge>
        )
      }

      // Special handling for markdown fields
      if (field?.type === "markdown" && typeof value === "string") {
        return <MarkdownDisplay content={value} />
      }

      // Special handling for user fields
      if (field?.type === "user" && typeof value === "string") {
        return <UserField userId={value} fieldKey={fieldKey} spaceSlug={spaceSlug} />
      }

      return <>{formatFieldValue(value, field?.type)}</>
    }
  }
}

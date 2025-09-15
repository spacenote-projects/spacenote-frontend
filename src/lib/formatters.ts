/**
 * Format a date to a readable string with full date and time
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

/**
 * Format a date to a readable string with date only
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

/**
 * Format a field value based on its type
 */
export function formatFieldValue(value: string | boolean | string[] | number | null | undefined, fieldType?: string): string {
  if (value == null) {
    return "-"
  }

  if (!fieldType) {
    return String(value)
  }

  switch (fieldType) {
    case "datetime":
      return typeof value === "string" ? formatDateTime(value) : String(value)
    case "string_choice":
    case "tags":
      if (Array.isArray(value)) {
        return value.join(", ")
      }
      return String(value)
    case "boolean":
      return value ? "Yes" : "No"
    default:
      return String(value)
  }
}

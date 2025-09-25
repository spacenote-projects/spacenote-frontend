/**
 * Format a date to a readable string with full date and time
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date

  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, "0")
  const day = String(dateObj.getDate()).padStart(2, "0")
  const hours = String(dateObj.getHours()).padStart(2, "0")
  const minutes = String(dateObj.getMinutes()).padStart(2, "0")

  const timezone =
    dateObj
      .toLocaleDateString("en-US", {
        timeZoneName: "short",
      })
      .split(" ")
      .pop() ?? ""

  return `${String(year)}-${month}-${day} ${hours}:${minutes} ${timezone}`
}

/**
 * Format a date to a readable string with date only
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date

  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, "0")
  const day = String(dateObj.getDate()).padStart(2, "0")

  return `${String(year)}-${month}-${day}`
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
    case "markdown":
      // Return raw markdown string - will be rendered by MarkdownDisplay component
      return String(value)
    case "user":
      // User fields store UUID, display handled by component
      return String(value)
    default:
      return String(value)
  }
}

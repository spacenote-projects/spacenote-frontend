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
    case "markdown":
      // Return raw markdown string - will be rendered by MarkdownDisplay component
      return String(value)
    default:
      return String(value)
  }
}

/**
 * Format a date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${String(diffInMinutes)} minute${diffInMinutes !== 1 ? "s" : ""} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${String(diffInHours)} hour${diffInHours !== 1 ? "s" : ""} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${String(diffInDays)} day${diffInDays !== 1 ? "s" : ""} ago`
  }

  return formatDate(dateObj)
}

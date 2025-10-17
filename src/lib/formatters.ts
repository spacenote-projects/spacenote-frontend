/**
 * Format a date to a readable string with full date and time
 */
export function formatDateTime(date: Date | string): string {
  let dateObj: Date
  if (typeof date === "string") {
    // If the string doesn't end with 'Z' or timezone offset, append 'Z' to treat it as UTC
    const dateString = date.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(date) ? date : date + "Z"
    dateObj = new Date(dateString)
  } else {
    dateObj = date
  }

  return dateObj.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
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
 * Format file size in bytes to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"

  const units = ["B", "KB", "MB", "GB"]
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`
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
    case "image":
      // Image fields store attachment UUID
      return typeof value === "string" && value ? "Image" : "-"
    default:
      return String(value)
  }
}

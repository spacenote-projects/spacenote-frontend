/**
 * Convert datetime-local input value (user's local time) to UTC ISO string for backend.
 *
 * The HTML datetime-local input provides values like "2025-10-20T13:00" which represent
 * times in the user's local timezone. The backend expects ISO strings and treats them as UTC.
 * This function converts the local time to UTC before sending to the backend.
 *
 * @param localDatetime - Value from datetime-local input (e.g., "2025-10-20T13:00")
 * @returns ISO string in UTC without timezone suffix (e.g., "2025-10-20T10:00:00")
 *
 * @example
 * // User in UTC+3 selects 1 PM local time
 * localDatetimeToUTC("2025-10-20T13:00") // Returns "2025-10-20T10:00:00"
 */
export function localDatetimeToUTC(localDatetime: string): string {
  if (!localDatetime) return ""

  // Parse the local datetime string as local time
  const localDate = new Date(localDatetime)

  // Convert to UTC and format as ISO string
  const year = localDate.getUTCFullYear()
  const month = String(localDate.getUTCMonth() + 1).padStart(2, "0")
  const day = String(localDate.getUTCDate()).padStart(2, "0")
  const hours = String(localDate.getUTCHours()).padStart(2, "0")
  const minutes = String(localDate.getUTCMinutes()).padStart(2, "0")
  const seconds = String(localDate.getUTCSeconds()).padStart(2, "0")

  return `${String(year)}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

/**
 * Convert UTC ISO string from backend to datetime-local input format (user's local time).
 *
 * The backend returns UTC ISO strings like "2025-10-20T10:00:00Z". The datetime-local
 * input expects values in the user's local timezone. This function converts from UTC
 * to local time for editing.
 *
 * @param utcDatetime - UTC ISO string from backend (e.g., "2025-10-20T10:00:00Z")
 * @returns datetime-local format in user's timezone (e.g., "2025-10-20T13:00")
 *
 * @example
 * // Backend returns 10 AM UTC, user in UTC+3 sees 1 PM
 * utcToLocalDatetime("2025-10-20T10:00:00Z") // Returns "2025-10-20T13:00"
 */
export function utcToLocalDatetime(utcDatetime: string): string {
  if (!utcDatetime) return ""

  // Ensure the string is treated as UTC
  const dateString = utcDatetime.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(utcDatetime) ? utcDatetime : utcDatetime + "Z"
  const date = new Date(dateString)

  // Format as datetime-local (ISO 8601 without timezone, in local time)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")

  return `${String(year)}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Get the user's timezone name for display purposes.
 *
 * @returns Timezone name (e.g., "America/New_York", "Europe/London", "Asia/Tokyo")
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Get the user's timezone offset in hours for display purposes.
 *
 * @returns Offset string (e.g., "UTC+3", "UTC-5", "UTC+0")
 */
export function getUserTimezoneOffset(): string {
  const offsetMinutes = -new Date().getTimezoneOffset()
  const offsetHours = offsetMinutes / 60
  const sign = offsetHours >= 0 ? "+" : ""
  return `UTC${sign}${String(offsetHours)}`
}

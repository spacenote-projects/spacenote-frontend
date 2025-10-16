import type { FieldType } from "@/types"

/**
 * Configuration for clickable field types
 * Maps field type to the filter operator used when clicking
 */
export const CLICKABLE_FIELD_CONFIG: Record<FieldType, string | null> = {
  tags: "in",
  string_choice: "eq",
  user: "eq",
  string: null,
  markdown: null,
  boolean: null,
  datetime: null,
  int: null,
  float: null,
  image: null,
}

/**
 * Build a filter query string for a clickable field
 * @param fieldId - The field identifier
 * @param fieldType - The field type (can be any string, will be validated)
 * @param value - The field value (string or array for tags)
 * @returns Query string (e.g., "tags:in:[\"drum\"]") or null if field type not clickable
 */
export function buildFieldFilterQuery(fieldId: string, fieldType: string, value: string | string[]): string | null {
  const operator = CLICKABLE_FIELD_CONFIG[fieldType as FieldType]
  if (!operator) return null

  // Build query based on operator type
  let queryValue: string
  if (operator === "in") {
    // For 'in' operator, value should be an array
    const arrayValue = Array.isArray(value) ? value : [value]
    queryValue = encodeURIComponent(JSON.stringify(arrayValue))
  } else {
    // For 'eq' operator, use the value directly
    const stringValue = Array.isArray(value) ? value[0] : value
    queryValue = encodeURIComponent(stringValue)
  }

  return `${fieldId}:${operator}:${queryValue}`
}

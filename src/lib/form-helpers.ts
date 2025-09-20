import { z } from "zod"
import type { SpaceField, User } from "@/types"

/**
 * Create Zod schema for form fields based on space fields
 */
export function createFieldSchema(fields: SpaceField[]) {
  return z.object(
    fields.reduce<Record<string, z.ZodType>>((acc, field) => {
      if (field.type === "boolean") {
        acc[field.name] = z.boolean().default(false)
      } else if (field.required) {
        acc[field.name] = z.string().min(1, `${field.name} is required`)
      } else {
        acc[field.name] = z.string().optional()
      }
      return acc
    }, {})
  )
}

/**
 * Convert note field values to form values
 */
export function noteToFormValues(fields: SpaceField[], noteFields: Record<string, unknown>) {
  return fields.reduce<Record<string, string | boolean>>((acc, field) => {
    const value = noteFields[field.name]

    if (field.type === "boolean") {
      acc[field.name] = value === true || value === "true"
    } else if (field.type === "tags" && Array.isArray(value)) {
      acc[field.name] = value.join(", ")
    } else if (typeof value === "string" || typeof value === "number") {
      acc[field.name] = String(value)
    } else {
      acc[field.name] = ""
    }
    return acc
  }, {})
}

/**
 * Convert field defaults to form values
 */
export function fieldsToDefaultValues(fields: SpaceField[], currentUser?: User) {
  return fields.reduce<Record<string, string | boolean>>((acc, field) => {
    if (field.default !== undefined && field.default !== null) {
      if (field.type === "user" && field.default === "$me" && currentUser) {
        acc[field.name] = currentUser.id
      } else if (field.type === "boolean") {
        acc[field.name] = field.default === "true" || field.default === true
      } else if (Array.isArray(field.default)) {
        acc[field.name] = field.default.join(", ")
      } else if (typeof field.default === "string" || typeof field.default === "number") {
        acc[field.name] = String(field.default)
      } else {
        acc[field.name] = ""
      }
    } else {
      acc[field.name] = field.type === "boolean" ? false : ""
    }
    return acc
  }, {})
}

/**
 * Convert form values to raw fields for API
 */
export function formToRawFields(data: Record<string, unknown>) {
  return Object.entries(data).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === "boolean") {
      acc[key] = value ? "true" : "false"
    } else if (typeof value === "string" && value !== "") {
      acc[key] = value
    } else if (typeof value === "number") {
      acc[key] = value.toString()
    }
    return acc
  }, {})
}

/**
 * Convert only dirty form fields to raw fields for API
 */
export function dirtyFieldsToRawFields(data: Record<string, unknown>, dirtyFields: Partial<Record<string, boolean | undefined>>) {
  const dirtyKeys = Object.keys(dirtyFields).filter((key) => dirtyFields[key] === true)

  return dirtyKeys.reduce<Record<string, string>>((acc, key) => {
    const value = data[key]

    if (typeof value === "boolean") {
      acc[key] = value ? "true" : "false"
    } else if (typeof value === "string") {
      acc[key] = value
    } else if (typeof value === "number") {
      acc[key] = value.toString()
    }
    return acc
  }, {})
}

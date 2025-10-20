import { z } from "zod"
import type { SpaceField, User } from "@/types"
import { localDatetimeToUTC, utcToLocalDatetime } from "@/lib/datetime"

/**
 * Create Zod schema for form fields based on space fields
 */
export function createFieldSchema(fields: SpaceField[]) {
  return z.object(
    fields.reduce<Record<string, z.ZodType>>((acc, field) => {
      if (field.type === "boolean") {
        acc[field.id] = z.boolean().default(false)
      } else if (field.required) {
        acc[field.id] = z.string().min(1, `${field.id} is required`)
      } else {
        acc[field.id] = z.string().optional()
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
    const value = noteFields[field.id]

    if (field.type === "boolean") {
      acc[field.id] = value === true || value === "true"
    } else if (field.type === "datetime" && typeof value === "string") {
      acc[field.id] = utcToLocalDatetime(value)
    } else if (field.type === "tags" && Array.isArray(value)) {
      acc[field.id] = value.join(", ")
    } else if (typeof value === "string" || typeof value === "number") {
      acc[field.id] = String(value)
    } else {
      acc[field.id] = ""
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
        acc[field.id] = currentUser.id
      } else if (field.type === "datetime" && field.default === "$now") {
        acc[field.id] = "$now"
      } else if (field.type === "boolean") {
        acc[field.id] = field.default === "true" || field.default === true
      } else if (Array.isArray(field.default)) {
        acc[field.id] = field.default.join(", ")
      } else if (typeof field.default === "string" || typeof field.default === "number") {
        acc[field.id] = String(field.default)
      } else {
        acc[field.id] = ""
      }
    } else {
      acc[field.id] = field.type === "boolean" ? false : ""
    }
    return acc
  }, {})
}

/**
 * Convert form values to raw fields for API
 */
export function formToRawFields(data: Record<string, unknown>, fields: SpaceField[]) {
  const fieldTypeMap = new Map(fields.map((field) => [field.id, field.type]))

  return Object.entries(data).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === "boolean") {
      acc[key] = value ? "true" : "false"
    } else if (typeof value === "string" && value !== "") {
      if (fieldTypeMap.get(key) === "datetime" && value !== "$now") {
        acc[key] = localDatetimeToUTC(value)
      } else {
        acc[key] = value
      }
    } else if (typeof value === "number") {
      acc[key] = value.toString()
    }
    return acc
  }, {})
}

/**
 * Convert only dirty form fields to raw fields for API
 */
export function dirtyFieldsToRawFields(
  data: Record<string, unknown>,
  dirtyFields: Partial<Record<string, boolean | undefined>>,
  fields: SpaceField[]
) {
  const dirtyKeys = Object.keys(dirtyFields).filter((key) => dirtyFields[key] === true)
  const fieldTypeMap = new Map(fields.map((field) => [field.id, field.type]))

  return dirtyKeys.reduce<Record<string, string>>((acc, key) => {
    const value = data[key]

    if (typeof value === "boolean") {
      acc[key] = value ? "true" : "false"
    } else if (typeof value === "string") {
      if (fieldTypeMap.get(key) === "datetime" && value !== "$now") {
        acc[key] = localDatetimeToUTC(value)
      } else {
        acc[key] = value
      }
    } else if (typeof value === "number") {
      acc[key] = value.toString()
    }
    return acc
  }, {})
}

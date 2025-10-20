import { Liquid } from "liquidjs"
import { formatDate, formatDateTime, formatFieldValue } from "@/lib/formatters"
import { markdownToHtmlSafeSync } from "@/lib/markdown"
import type { Note, Space, User, SpaceField } from "@/types"

const engine = new Liquid({
  strictFilters: false,
  strictVariables: false,
  lenientIf: true,
  jsTruthy: true,
})

engine.registerFilter("date", (value: string | Date) => {
  if (!value) return ""
  return formatDate(value)
})

engine.registerFilter("datetime", (value: string | Date) => {
  if (!value) return ""
  return formatDateTime(value)
})

engine.registerFilter("user", (userId: string, users: User[]) => {
  if (!userId) return ""
  const user = users.find((u) => u.id === userId)
  return "👤" + (user?.username ?? userId)
})

engine.registerFilter("user_link", (userId: string, fieldId: string, users: User[]) => {
  if (!userId || !fieldId) return ""
  const user = users.find((u) => u.id === userId)
  if (!user) return "👤Unknown"
  return `<span class="cursor-pointer hover:underline" data-field-id="${fieldId}" data-field-type="user" data-field-value="${user.username}">👤${user.username}</span>`
})

engine.registerFilter("select_link", (value: string, fieldId: string) => {
  if (!value || !fieldId) return ""
  return `<span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors" data-field-id="${fieldId}" data-field-type="select" data-field-value="${value}">${value}</span>`
})

engine.registerFilter("field_value", (value: unknown, fieldType?: string) => {
  if (value === null || value === undefined) return ""

  if (fieldType === "tags") {
    if (Array.isArray(value)) {
      return value.map((tag: string) => `<span data-tag="${tag}">${tag}</span>`).join(", ")
    }
  }

  if (fieldType === "select") {
    if (Array.isArray(value)) {
      return value.join(", ")
    }
  }

  if (fieldType === "boolean") {
    // value is already checked for null/undefined above
    return (value as boolean) ? "Yes" : "No"
  }

  return formatFieldValue(value as string | boolean | string[] | number | null, fieldType)
})

engine.registerFilter("field_label", (fieldId: string, fields: SpaceField[]) => {
  if (!fieldId) return fieldId
  const field = fields.find((f) => f.id === fieldId)
  return field?.id ?? fieldId
})

engine.registerFilter("json", (value: unknown) => {
  return JSON.stringify(value, null, 2)
})

engine.registerFilter("default", (value: unknown, defaultValue: string) => {
  return value ?? defaultValue
})

engine.registerFilter("markdown", (value: string) => {
  if (!value) return ""
  return markdownToHtmlSafeSync(value)
})

engine.registerFilter("tag_link", (tag: string, fieldId: string) => {
  if (!tag || !fieldId) return ""
  return `<span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors" data-field-id="${fieldId}" data-field-type="tags" data-field-value="${tag}">${tag}</span>`
})

engine.registerFilter("tags_links", (tags: string[], fieldId: string) => {
  if (!Array.isArray(tags) || tags.length === 0 || !fieldId) return ""
  return tags
    .map(
      (tag) =>
        `<span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors" data-field-id="${fieldId}" data-field-type="tags" data-field-value="${tag}">${tag}</span>`
    )
    .join(" ")
})

engine.registerFilter("image_url", (fieldId: string, spaceSlug: string, noteNumber: number) => {
  if (!fieldId || !spaceSlug || !noteNumber) return ""
  return `/api/v1/spaces/${spaceSlug}/notes/${String(noteNumber)}/images/${fieldId}`
})

interface NoteDetailTemplateContext {
  note: Note
  space: Space
  users: User[]
}

interface NoteListTemplateContext {
  notes: Note[]
  space: Space
  users: User[]
}

export async function renderNoteDetailTemplate(
  template: string,
  context: NoteDetailTemplateContext
): Promise<{ html: string; error?: string }> {
  try {
    const html = (await engine.parseAndRender(template, context)) as string
    return { html }
  } catch (error) {
    console.error("Template rendering error:", error)
    return {
      html: "",
      error: error instanceof Error ? error.message : "Template rendering failed",
    }
  }
}

export async function renderNoteListTemplate(
  template: string,
  context: NoteListTemplateContext
): Promise<{ html: string; error?: string }> {
  try {
    const html = (await engine.parseAndRender(template, context)) as string
    return { html }
  } catch (error) {
    console.error("Template rendering error:", error)
    return {
      html: "",
      error: error instanceof Error ? error.message : "Template rendering failed",
    }
  }
}

export function isValidTemplate(template: string): boolean {
  try {
    engine.parse(template)
    return true
  } catch {
    return false
  }
}

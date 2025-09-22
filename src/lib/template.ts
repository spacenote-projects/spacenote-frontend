import { Liquid } from "liquidjs"
import { formatDate, formatDateTime, formatRelativeTime, formatFieldValue } from "@/lib/formatters"
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

engine.registerFilter("relative_time", (value: string | Date) => {
  if (!value) return ""
  return formatRelativeTime(value)
})

engine.registerFilter("user", (userId: string, users: User[]) => {
  if (!userId) return ""
  const user = users.find((u) => u.id === userId)
  return user?.username ?? userId
})

engine.registerFilter("field_value", (value: unknown, fieldType?: string) => {
  if (value === null || value === undefined) return ""

  if (fieldType === "tags" || fieldType === "string_choice") {
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
    const noteFields: Record<string, unknown> = {}
    for (const field of context.space.fields) {
      noteFields[field.id] = context.note.fields[field.id] ?? null
    }

    const templateContext = {
      note: {
        ...context.note,
        ...noteFields,
        fields: context.note.fields,
      },
      space: context.space,
      users: context.users,
      fields: context.space.fields,
    }

    const html = (await engine.parseAndRender(template, templateContext)) as string
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
    const notesWithFields = context.notes.map((note) => {
      const noteFields: Record<string, unknown> = {}
      for (const field of context.space.fields) {
        noteFields[field.id] = note.fields[field.id] ?? null
      }
      return {
        ...note,
        ...noteFields,
        fields: note.fields,
      }
    })

    const templateContext = {
      notes: notesWithFields,
      space: context.space,
      users: context.users,
      fields: context.space.fields,
    }

    const html = (await engine.parseAndRender(template, templateContext)) as string
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

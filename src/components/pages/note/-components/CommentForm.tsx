import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import { createFieldSchema, noteToFormValues, dirtyFieldsToRawFields } from "@/lib/form-helpers"
import FieldInput from "@/components/shared/FieldInput"
import type { Space, Note } from "@/types"

const commentSchema = z.object({
  content: z.string().min(1, "Comment is required").max(5000, "Comment is too long"),
})

export function CommentForm({ slug, noteNumber, space, note }: { slug: string; noteNumber: number; space: Space; note: Note }) {
  const mutation = api.mutations.useCreateComment()
  const [showFields, setShowFields] = useState(false)

  const editableFields = space.fields.filter((f) => space.comment_editable_fields.includes(f.id))
  const hasEditableFields = editableFields.length > 0

  const fieldSchema = hasEditableFields ? createFieldSchema(editableFields) : z.object({})
  const formSchema = commentSchema.extend(fieldSchema.shape)

  type FormData = z.infer<typeof formSchema>

  const fieldDefaults = hasEditableFields ? noteToFormValues(editableFields, note.fields) : {}

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      ...fieldDefaults,
    } as FormData,
  })

  // Subscribe to dirty state tracking (React Hook Form requires reading formState during render)
  const { dirtyFields: dirtyFieldsState } = form.formState

  const onSubmit = (data: FormData) => {
    const editableFieldIds = editableFields.map((f) => f.id)
    const dirtyFields = dirtyFieldsState as Record<string, boolean | undefined>
    const filteredDirtyFields = Object.keys(dirtyFields)
      .filter((key) => editableFieldIds.includes(key) && dirtyFields[key])
      .reduce<Record<string, boolean | undefined>>((acc, key) => ({ ...acc, [key]: dirtyFields[key] }), {})

    const rawFields = hasEditableFields ? dirtyFieldsToRawFields(data, filteredDirtyFields, editableFields) : {}

    mutation.mutate(
      {
        slug,
        number: noteNumber,
        data: {
          content: data.content.trim(),
          raw_fields: Object.keys(rawFields).length > 0 ? rawFields : undefined,
        },
      },
      {
        onSuccess: () => {
          form.reset()
          setShowFields(false)
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {showFields && hasEditableFields && (
          <div className="space-y-4 pb-4 border-b">
            {editableFields.map((field) => (
              <FieldInput key={field.id} field={field} control={form.control} name={field.id} space={space} />
            ))}
          </div>
        )}

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea {...field} placeholder="Add a comment..." disabled={mutation.isPending} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mutation.error && <ErrorMessage error={mutation.error} />}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Posting..." : "Post Comment"}
          </Button>
          {hasEditableFields && (
            <button
              type="button"
              onClick={() => {
                setShowFields(!showFields)
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {showFields ? "Hide fields" : "Edit fields"}
            </button>
          )}
        </div>
      </form>
    </Form>
  )
}

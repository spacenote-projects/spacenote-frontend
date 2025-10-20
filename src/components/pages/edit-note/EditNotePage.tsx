import { useParams, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSuspenseQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { cache } from "@/hooks/useCache"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"
import { createFieldSchema, noteToFormValues, dirtyFieldsToRawFields } from "@/lib/form-helpers"
import type { UpdateNoteFieldsRequest } from "@/types"
import FieldInput from "@/components/shared/FieldInput"

export default function EditNotePage() {
  const { slug, number } = useParams() as { slug: string; number: string }
  const navigate = useNavigate()
  const space = cache.useSpace(slug)
  const { data: note } = useSuspenseQuery(api.queries.spaceNote(slug, Number(number)))
  const mutation = api.mutations.useUpdateNoteFields()

  // Create dynamic schema based on space fields
  const formSchema = createFieldSchema(space.fields)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: noteToFormValues(space.fields, note.fields),
  })

  const onSubmit = (data: Record<string, unknown>) => {
    // Only include dirty fields in the update
    const updateData: UpdateNoteFieldsRequest = {
      raw_fields: dirtyFieldsToRawFields(data, form.formState.dirtyFields, space.fields),
    }

    mutation.mutate(
      { slug, number: Number(number), data: updateData },
      {
        onSuccess: () => {
          void navigate(`/s/${slug}/${number}`)
        },
      }
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <SpacePageHeader space={space} section={`Edit Note #${number}`} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {space.fields.map((field) => (
            <FieldInput key={field.id} field={field} control={form.control} name={field.id} space={space} />
          ))}

          {mutation.error && <ErrorMessage error={mutation.error} />}

          <div className="flex gap-3">
            <Button type="submit" disabled={mutation.isPending || !form.formState.isDirty}>
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

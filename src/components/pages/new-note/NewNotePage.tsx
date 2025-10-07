import { useParams, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/lib/api"
import { cache } from "@/hooks/useCache"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"
import { createFieldSchema, fieldsToDefaultValues, formToRawFields } from "@/lib/form-helpers"
import { getNotesListParams } from "@/lib/navigation"
import type { CreateNoteRequest } from "@/types"
import FieldInput from "@/components/shared/FieldInput"

export default function NewNotePage() {
  const { slug } = useParams() as { slug: string }
  const navigate = useNavigate()
  const space = cache.useSpace(slug)
  const mutation = api.mutations.useCreateNote()
  const currentUser = cache.useCurrentUser()

  // Filter out hidden fields
  const visibleFields = space.fields.filter((field) => !space.hidden_create_fields.includes(field.id))

  // Create dynamic schema based on space fields
  const formSchema = createFieldSchema(visibleFields)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: fieldsToDefaultValues(visibleFields, currentUser),
  })

  const onSubmit = (data: Record<string, unknown>) => {
    const noteData: CreateNoteRequest = {
      raw_fields: formToRawFields(data),
    }

    mutation.mutate(
      { slug, data: noteData },
      {
        onSuccess: () => {
          const savedParams = getNotesListParams(slug)
          const returnUrl = savedParams ? `/s/${slug}?${savedParams}` : `/s/${slug}`
          void navigate(returnUrl)
        },
      }
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <SpacePageHeader space={space} section="New Note" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {visibleFields.map((field) => (
            <FieldInput key={field.id} field={field} control={form.control} name={field.id} space={space} />
          ))}

          {mutation.error && <ErrorMessage error={mutation.error} />}

          <div className="flex gap-3">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create Note"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

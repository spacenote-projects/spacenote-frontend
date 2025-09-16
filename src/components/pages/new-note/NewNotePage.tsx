import { useParams, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { api } from "@/lib/api"
import { useSpace } from "@/hooks/useCache"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"
import type { CreateNoteRequest } from "@/types"
import FieldInput from "./-components/FieldInput"

export default function NewNotePage() {
  const { slug } = useParams() as { slug: string }
  const navigate = useNavigate()
  const space = useSpace(slug)
  const mutation = api.mutations.useCreateNote()

  // Filter out hidden fields
  const visibleFields = space.fields.filter((field) => !space.hidden_create_fields.includes(field.name))

  // Create dynamic schema based on space fields
  const formSchema = z.object(
    visibleFields.reduce<Record<string, z.ZodType>>((acc, field) => {
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

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: visibleFields.reduce<Record<string, string | boolean>>((acc, field) => {
      acc[field.name] = field.type === "boolean" ? false : ""
      return acc
    }, {}),
  })

  const onSubmit = (data: FormData) => {
    const noteData: CreateNoteRequest = {
      raw_fields: Object.entries(data).reduce<Record<string, string>>((acc, [key, value]) => {
        // Handle different value types
        if (typeof value === "boolean") {
          acc[key] = value ? "true" : "false"
        } else if (typeof value === "string" && value !== "") {
          acc[key] = value
        } else if (typeof value === "number") {
          acc[key] = value.toString()
        }
        return acc
      }, {}),
    }

    mutation.mutate(
      { slug, data: noteData },
      {
        onSuccess: () => {
          void navigate(`/s/${slug}`)
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
            <FieldInput key={field.name} field={field} control={form.control} name={field.name} />
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

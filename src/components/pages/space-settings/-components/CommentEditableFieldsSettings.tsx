import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import type { Space } from "@/types"

const formSchema = z.object({
  fieldNames: z.string(),
})

type FormData = z.infer<typeof formSchema>

export function CommentEditableFieldsSettings({ space }: { space: Space }) {
  const mutation = api.mutations.useUpdateCommentEditableFields()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldNames: space.comment_editable_fields.join(", "),
    },
  })

  const onSubmit = (data: FormData) => {
    const fieldNames = data.fieldNames
      .split(",")
      .map((field) => field.trim())
      .filter((field) => field.length > 0)

    mutation.mutate(
      { slug: space.slug, fieldNames },
      {
        onSuccess: () => {
          toast.success("Comment editable fields updated successfully")
        },
      }
    )
  }

  const availableFields = space.fields.map((f) => f.id).join(", ")

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Comment Editable Fields</h2>
      <div className="border rounded-lg p-4 space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fieldNames"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fields editable when commenting</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input {...field} placeholder="status, priority" className="flex-1" disabled={mutation.isPending} />
                    </FormControl>
                    <Button type="submit" disabled={mutation.isPending}>
                      {mutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                  <FormDescription>Enter field names separated by commas</FormDescription>
                  {availableFields && <FormDescription>Available fields: {availableFields}</FormDescription>}
                  <FormMessage />
                </FormItem>
              )}
            />
            {mutation.error && <ErrorMessage error={mutation.error} />}
          </form>
        </Form>
      </div>
    </section>
  )
}

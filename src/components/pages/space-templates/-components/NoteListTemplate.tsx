import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import type { Space } from "@/types"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  content: z.string(),
})

type FormData = z.infer<typeof formSchema>

export function NoteListTemplateEditor({ space }: { space: Space }) {
  const mutation = api.mutations.useUpdateSpaceTemplate()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: space.templates.note_list ?? "",
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      {
        slug: space.slug,
        data: {
          name: "note_list",
          content: data.content.trim() || null,
        },
      },
      {
        onSuccess: () => {
          toast.success("Note list template has been updated")
        },
      }
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>List View</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note List Template</FormLabel>
                  <FormDescription>
                    Customize how notes appear in list views. Use Liquid template syntax to access note fields.
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Example: {{ note.title }} - {{ note.status }}"
                      disabled={mutation.isPending}
                      rows={10}
                      className="font-mono text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mutation.error && <ErrorMessage error={mutation.error} />}

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save Template"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

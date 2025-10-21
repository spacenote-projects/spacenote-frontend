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

const formSchema = z.object({
  content: z.string(),
})

type FormData = z.infer<typeof formSchema>

interface TemplateEditorProps {
  space: Space
  templateName: "note_list" | "note_detail"
  label: string
  description: string
  placeholder: string
}

export function TemplateEditor({ space, templateName, label, description, placeholder }: TemplateEditorProps) {
  const mutation = api.mutations.useUpdateSpaceTemplate()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: space.templates[templateName] ?? "",
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      {
        slug: space.slug,
        data: {
          name: templateName,
          content: data.content.trim() || null,
        },
      },
      {
        onSuccess: () => {
          toast.success(`${label} template has been updated`)
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormDescription>{description}</FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={placeholder}
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
  )
}

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { ErrorMessage } from "@/components/shared/ErrorMessage"

const formSchema = z.object({
  content: z.string().min(1, "Comment is required").max(5000, "Comment is too long"),
})

type FormData = z.infer<typeof formSchema>

export function CommentForm({ slug, noteNumber }: { slug: string; noteNumber: number }) {
  const mutation = api.mutations.useCreateComment()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      {
        slug,
        number: noteNumber,
        data: {
          content: data.content.trim(),
        },
      },
      {
        onSuccess: () => {
          form.reset()
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
              <FormControl>
                <Textarea {...field} placeholder="Add a comment..." disabled={mutation.isPending} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mutation.error && <ErrorMessage error={mutation.error} />}

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Posting..." : "Post Comment"}
        </Button>
      </form>
    </Form>
  )
}

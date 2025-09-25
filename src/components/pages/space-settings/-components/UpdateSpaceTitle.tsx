import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import type { Space } from "@/types"

const schema = z.object({
  title: z.string().min(1, "Title is required"),
})

type FormData = z.infer<typeof schema>

export function UpdateSpaceTitle({ space }: { space: Space }) {
  const mutation = api.mutations.useUpdateSpaceTitle()
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: space.title,
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      { slug: space.slug, title: data.title },
      {
        onSuccess: () => {
          toast.success("Space title updated successfully")
        },
      }
    )
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Update Title</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...form.register("title")} placeholder="Enter space title" className="mt-1" />
          {form.formState.errors.title && <p className="text-sm text-destructive mt-1">{form.formState.errors.title.message}</p>}
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Updating..." : "Update Title"}
        </Button>
        {mutation.error && <ErrorMessage error={mutation.error} />}
      </form>
    </section>
  )
}

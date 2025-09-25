import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import type { Space } from "@/types"

const schema = z.object({
  description: z.string(),
})

type FormData = z.infer<typeof schema>

export function UpdateSpaceDescription({ space }: { space: Space }) {
  const mutation = api.mutations.useUpdateSpaceDescription()
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: space.description,
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      { slug: space.slug, description: data.description },
      {
        onSuccess: () => {
          toast.success("Space description updated successfully")
        },
      }
    )
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Update Description</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...form.register("description")}
            placeholder="Enter space description"
            className="mt-1"
            rows={4}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.description.message}</p>
          )}
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Updating..." : "Update Description"}
        </Button>
        {mutation.error && <ErrorMessage error={mutation.error} />}
      </form>
    </section>
  )
}

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import type { Space } from "@/types"

const schema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens (no leading/trailing/double hyphens)"
    ),
})

type FormData = z.infer<typeof schema>

export function UpdateSpaceSlug({ space }: { space: Space }) {
  const navigate = useNavigate()
  const mutation = api.mutations.useUpdateSpaceSlug()
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: space.slug,
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      { slug: space.slug, newSlug: data.slug },
      {
        onSuccess: (updatedSpace) => {
          toast.success("Space slug updated successfully")
          void navigate(`/s/${updatedSpace.slug}/settings`)
        },
      }
    )
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Update Slug</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...form.register("slug")} placeholder="Enter URL-friendly identifier" className="mt-1" />
          {form.formState.errors.slug && <p className="text-sm text-destructive mt-1">{form.formState.errors.slug.message}</p>}
          <p className="text-sm text-muted-foreground mt-1">
            The slug is used in the URL: /s/<strong>{form.watch("slug") || "your-slug"}</strong>
          </p>
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Updating..." : "Update Slug"}
        </Button>
        {mutation.error && <ErrorMessage error={mutation.error} />}
      </form>
    </section>
  )
}

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import type { Space } from "@/types"

const schema = z.object({
  defaultFilter: z.string(),
})

type FormData = z.infer<typeof schema>

export function UpdateDefaultFilter({ space }: { space: Space }) {
  const mutation = api.mutations.useUpdateDefaultFilter()
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      defaultFilter: space.default_filter ?? "none",
    },
  })

  const defaultFilter = useWatch({ control: form.control, name: "defaultFilter" })

  const onSubmit = (data: FormData) => {
    const filterValue = data.defaultFilter === "none" ? null : data.defaultFilter
    mutation.mutate(
      { slug: space.slug, defaultFilter: filterValue },
      {
        onSuccess: () => {
          toast.success("Default filter updated successfully")
        },
      }
    )
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Default Filter</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="defaultFilter">Default Filter</Label>
          <Select
            value={defaultFilter}
            onValueChange={(value) => {
              form.setValue("defaultFilter", value)
            }}
          >
            <SelectTrigger id="defaultFilter" className="mt-1">
              <SelectValue placeholder="Select default filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {space.filters.map((filter) => (
                <SelectItem key={filter.id} value={filter.id}>
                  {filter.title}
                  {filter.description && ` - ${filter.description}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.defaultFilter && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.defaultFilter.message}</p>
          )}
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Updating..." : "Update Default Filter"}
        </Button>
        {mutation.error && <ErrorMessage error={mutation.error} />}
      </form>
    </section>
  )
}

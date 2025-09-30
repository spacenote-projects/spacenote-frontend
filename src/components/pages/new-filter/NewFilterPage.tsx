import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import { toast } from "sonner"
import { cache } from "@/hooks/useCache"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"
import { FilterConditionsEditor } from "./-components/FilterConditionsEditor"
import type { FilterCondition } from "@/types"

const formSchema = z.object({
  id: z
    .string()
    .min(1, "Filter ID is required")
    .regex(
      /^[a-z_][a-z0-9_-]*$/,
      "Filter ID must start with lowercase letter or underscore, and contain only lowercase letters, numbers, underscores, and hyphens"
    ),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  conditions: z
    .array(
      z.object({
        field: z.string(),
        operator: z.string(),
        value: z.any(),
      })
    )
    .optional(),
  sort: z.string().optional(),
  listFields: z.string().optional(),
})

export default function NewFilterPage() {
  const { slug } = useParams() as { slug: string }
  const navigate = useNavigate()
  const space = cache.useSpace(slug)
  const mutation = api.mutations.useAddFilter()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      title: "",
      description: "",
      conditions: [] as FilterCondition[],
      sort: "",
      listFields: "",
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    const sort = data.sort
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    const listFields = data.listFields
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    const conditions = data.conditions?.filter((c) => c.field) as FilterCondition[] | undefined

    mutation.mutate(
      {
        slug,
        filter: {
          id: data.id,
          title: data.title,
          description: data.description ?? "",
          conditions: conditions?.length ? conditions : undefined,
          sort,
          list_fields: listFields,
        },
      },
      {
        onSuccess: () => {
          toast.success("Filter created successfully")
          void navigate(`/s/${slug}/filters`)
        },
      }
    )
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <SpacePageHeader space={space} section="New Filter" />

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Filter ID</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="active_tasks" />
                </FormControl>
                <FormDescription>Internal identifier (lowercase, underscores, and hyphens only)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Active Tasks" />
                </FormControl>
                <FormDescription>User-friendly name shown in the interface</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Shows all active tasks that need attention" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="conditions"
            render={({ field }) => (
              <FormItem>
                <FilterConditionsEditor
                  conditions={(field.value ?? []) as FilterCondition[]}
                  onChange={field.onChange}
                  fields={space.fields}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sort"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort Order</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="created_at, -updated_at" />
                </FormControl>
                <FormDescription>Comma-separated field names. Use - prefix for descending order.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="listFields"
            render={({ field }) => (
              <FormItem>
                <FormLabel>List View Fields</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="title, status, assigned_to" />
                </FormControl>
                <FormDescription>Fields to show in the notes list when this filter is active</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {mutation.error && <ErrorMessage error={mutation.error} />}

          <div className="flex gap-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create Filter"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import { toast } from "sonner"
import { cache } from "@/hooks/useCache"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"
import type { FieldType } from "@/types"

const fieldTypes: FieldType[] = ["string", "markdown", "boolean", "string_choice", "tags", "user", "datetime", "int", "float"]

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Field name is required")
    .regex(
      /^[a-z_][a-z0-9_]*$/,
      "Field name must start with lowercase letter or underscore, and contain only lowercase letters, numbers, and underscores"
    ),
  type: z.enum(fieldTypes as [FieldType, ...FieldType[]]),
  required: z.boolean().default(false),
  default: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true
        try {
          JSON.parse(val)
          return true
        } catch {
          return false
        }
      },
      { message: "Default value must be valid JSON" }
    ),
  options: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true
        try {
          JSON.parse(val)
          return true
        } catch {
          return false
        }
      },
      { message: "Options must be valid JSON" }
    ),
})

export default function NewFieldPage() {
  const { slug } = useParams() as { slug: string }
  const navigate = useNavigate()
  const space = cache.useSpace(slug)
  const mutation = api.mutations.useAddSpaceField()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "string" as FieldType,
      required: false,
      default: "",
      options: "",
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    const options = data.options?.trim() ? (JSON.parse(data.options) as Record<string, string[] | number>) : undefined
    const defaultValue = data.default?.trim()
      ? (JSON.parse(data.default) as string | boolean | string[] | number | null)
      : undefined

    mutation.mutate(
      {
        slug,
        field: {
          name: data.name,
          type: data.type,
          required: data.required,
          default: defaultValue,
          options,
        },
      },
      {
        onSuccess: () => {
          toast.success("Field created successfully")
          void navigate(`/s/${slug}/fields`)
        },
      }
    )
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <SpacePageHeader space={space} section="New Field" />

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="field_name" />
                </FormControl>
                <FormDescription>Must start with lowercase letter or underscore</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fieldTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="required"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Required</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="default"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Value (JSON)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='"example" for string, true for boolean, 42 for number'
                    className="font-mono text-sm"
                  />
                </FormControl>
                <FormDescription>Default value in JSON format (e.g., "text", true, 123, ["tag1", "tag2"])</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="options"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Options (JSON)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder='{"values": ["option1", "option2"]} for string_choice, or {"min": 0, "max": 100} for numeric fields'
                    className="font-mono text-sm"
                  />
                </FormControl>
                <FormDescription>Optional field configuration in JSON format</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {mutation.error && <ErrorMessage error={mutation.error} />}

          <div className="flex gap-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create Field"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

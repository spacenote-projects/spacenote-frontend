import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import { toast } from "sonner"
import type { ExportData } from "@/types"

const formSchema = z.object({
  jsonData: z.string().min(1, "JSON data is required"),
  newSlug: z
    .string()
    .refine(
      (val) => !val || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(val),
      "Slug must be lowercase letters and numbers, optionally separated by single hyphens"
    )
    .optional(),
  createMissingUsers: z.boolean(),
})

type FormData = z.infer<typeof formSchema>

export default function ImportSpacePage() {
  const navigate = useNavigate()
  const mutation = api.mutations.useImportSpace()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jsonData: "",
      newSlug: "",
      createMissingUsers: false,
    },
  })

  const onSubmit = (data: FormData) => {
    let parsedData: ExportData
    try {
      parsedData = JSON.parse(data.jsonData) as ExportData
    } catch {
      form.setError("jsonData", { message: "Invalid JSON format" })
      return
    }

    mutation.mutate(
      {
        data: parsedData,
        newSlug: data.newSlug ?? undefined,
        createMissingUsers: data.createMissingUsers,
      },
      {
        onSuccess: (space) => {
          toast.success("Space imported successfully")
          void navigate(`/s/${space.slug}`)
        },
      }
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Import Space</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="jsonData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>JSON Export Data</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Paste your space export JSON here..."
                    rows={10}
                    className="font-mono text-sm"
                  />
                </FormControl>
                <FormDescription>Paste the complete JSON export from another space</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newSlug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Slug (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="my-imported-space" />
                </FormControl>
                <FormDescription>
                  Rename the space on import. Leave blank to use the original slug from the export.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="createMissingUsers"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Create missing users</FormLabel>
                  <FormDescription>Automatically create user accounts that don't exist (with random passwords)</FormDescription>
                </div>
              </FormItem>
            )}
          />

          {mutation.error && <ErrorMessage error={mutation.error} />}

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Importing..." : "Import Space"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

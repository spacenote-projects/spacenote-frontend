import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import { toast } from "sonner"

const formSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase letters and numbers, optionally separated by single hyphens"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
})

type FormData = z.infer<typeof formSchema>

export default function NewSpacePage() {
  const navigate = useNavigate()
  const mutation = api.mutations.useCreateSpace()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: "",
      title: "",
      description: "",
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(data, {
      onSuccess: (space) => {
        toast.success("Space created successfully")
        void navigate(`/s/${space.slug}`)
      },
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create New Space</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="My Project" />
                </FormControl>
                <FormDescription>Human-readable name for your space</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="my-project" />
                </FormControl>
                <FormDescription>URL-friendly identifier (lowercase letters, numbers, and hyphens only)</FormDescription>
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
                  <Textarea {...field} placeholder="Describe what this space is about..." rows={3} />
                </FormControl>
                <FormDescription>Brief description of your space</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {mutation.error && <ErrorMessage error={mutation.error} />}

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Create Space"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

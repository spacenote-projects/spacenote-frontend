import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ErrorMessage } from "@/components/shared/ErrorMessage"

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
})

type FormData = z.infer<typeof formSchema>

export function AddMemberForm({ slug }: { slug: string }) {
  const mutation = api.mutations.useAddMember()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      { slug, username: data.username.trim() },
      {
        onSuccess: () => {
          toast.success("Member added successfully")
          form.reset()
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex-1 max-w-xs">
              <FormControl>
                <Input {...field} placeholder="Enter username" disabled={mutation.isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Adding..." : "Add Member"}
        </Button>
      </form>
      {mutation.error && <ErrorMessage error={mutation.error} />}
    </Form>
  )
}

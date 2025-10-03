import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import { toast } from "sonner"

const formSchema = z.object({
  chat_id: z.string().min(1, "Chat ID is required"),
})

type FormData = z.infer<typeof formSchema>

export function CreateTelegramIntegration({ slug }: { slug: string }) {
  const navigate = useNavigate()
  const mutation = api.mutations.useCreateTelegramIntegration()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chat_id: "",
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(
      {
        slug,
        data,
      },
      {
        onSuccess: () => {
          toast.success("Telegram integration created successfully")
          void navigate(`/s/${slug}/telegram`)
        },
      }
    )
  })

  return (
    <div>
      <div className="mb-6 text-sm text-muted-foreground">
        Connect your space to Telegram to receive notifications about new notes and comments. The bot token is configured at the
        project level.
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="chat_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chat ID</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="-1001234567890 or @channelname" />
                </FormControl>
                <FormDescription>
                  The chat ID where notifications will be sent (can be a group, channel, or direct message)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {mutation.error && <ErrorMessage error={mutation.error} />}

          <div className="flex gap-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create Integration"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

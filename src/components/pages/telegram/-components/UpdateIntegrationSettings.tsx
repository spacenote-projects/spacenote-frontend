import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import { toast } from "sonner"
import type { TelegramIntegration, UpdateTelegramIntegrationRequest } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  chat_id: z.string().optional(),
  is_enabled: z.boolean(),
})

type FormData = z.infer<typeof formSchema>

export function UpdateIntegrationSettings({ slug, integration }: { slug: string; integration: TelegramIntegration }) {
  const mutation = api.mutations.useUpdateTelegramIntegration()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chat_id: "",
      is_enabled: integration.is_enabled,
    },
  })

  const {
    formState: { dirtyFields },
  } = form

  const onSubmit = form.handleSubmit((data) => {
    // Build update data based on dirty fields only
    const updateData: UpdateTelegramIntegrationRequest = {}

    // Only include fields that were actually changed
    if (dirtyFields.chat_id) {
      updateData.chat_id = data.chat_id ?? null
    }
    if (dirtyFields.is_enabled) {
      updateData.is_enabled = data.is_enabled
    }

    // Only make API call if something changed
    if (Object.keys(updateData).length === 0) {
      toast.info("No changes to save")
      return
    }

    mutation.mutate(
      {
        slug,
        data: updateData,
      },
      {
        onSuccess: () => {
          toast.success("Telegram integration updated successfully")
          // Reset form with current values to clear dirty state
          form.reset(form.getValues())
        },
      }
    )
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Integration</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="is_enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Enable Notifications</FormLabel>
                    <FormDescription>Toggle to enable or disable all Telegram notifications</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chat_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Chat ID (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Leave empty to keep current chat ID" />
                  </FormControl>
                  <FormDescription>Only fill this if you need to change the destination chat</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mutation.error && <ErrorMessage error={mutation.error} />}

            <div className="flex gap-4">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Updating..." : "Update Integration"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

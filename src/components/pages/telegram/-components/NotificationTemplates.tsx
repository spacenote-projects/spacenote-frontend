import { useState } from "react"
import type { TelegramIntegration, TelegramEventType } from "@/types"
import { api } from "@/lib/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import { toast } from "sonner"

export function NotificationTemplates({ slug, integration }: { slug: string; integration: TelegramIntegration }) {
  const mutation = api.mutations.useUpdateTelegramNotification()

  const eventTypes = [
    {
      value: "note_created" as const,
      label: "Note Created",
      description: "Notification when a new note is created",
    },
    {
      value: "note_updated" as const,
      label: "Note Updated",
      description: "Notification when a note is updated",
    },
    {
      value: "comment_created" as const,
      label: "New Comment",
      description: "Notification when a comment is added",
    },
  ] satisfies { value: TelegramEventType; label: string; description: string }[]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Templates</CardTitle>
        <p className="text-sm text-muted-foreground">Configure message templates for different events</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="note_created">
          <TabsList className="grid grid-cols-3 w-full">
            {eventTypes.map((event) => (
              <TabsTrigger key={event.value} value={event.value}>
                {event.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {eventTypes.map((event) => (
            <TabsContent key={event.value} value={event.value}>
              <NotificationForm
                slug={slug}
                eventType={event.value}
                description={event.description}
                initialConfig={integration.notifications[event.value]}
                mutation={mutation}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

function NotificationForm({
  slug,
  eventType,
  description,
  initialConfig,
  mutation,
}: {
  slug: string
  eventType: TelegramEventType
  description: string
  initialConfig: { enabled: boolean; template: string }
  mutation: ReturnType<typeof api.mutations.useUpdateTelegramNotification>
}) {
  const [enabled, setEnabled] = useState(initialConfig.enabled)
  const [template, setTemplate] = useState(initialConfig.template)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(
      {
        slug,
        eventType,
        data: { enabled, template },
      },
      {
        onSuccess: () => {
          toast.success("Notification template updated")
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor={`${eventType}-enabled`}>Enabled</Label>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Checkbox
          id={`${eventType}-enabled`}
          checked={enabled}
          onCheckedChange={(checked) => {
            setEnabled(checked === true)
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${eventType}-template`}>Message Template</Label>
        <Textarea
          id={`${eventType}-template`}
          value={template}
          onChange={(e) => {
            setTemplate(e.target.value)
          }}
          rows={6}
          placeholder="Enter message template..."
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Available variables: {"{{user.username}}"}, {"{{note.number}}"}, {"{{note.title}}"}, {"{{space.title}}"},{" "}
          {"{{comment.text}}"}
        </p>
      </div>

      {mutation.error && <ErrorMessage error={mutation.error} />}

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  )
}

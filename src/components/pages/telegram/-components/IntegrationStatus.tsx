import type { TelegramIntegration } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function IntegrationStatus({ integration }: { integration: TelegramIntegration }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Status:</span>{" "}
            <span className={integration.is_enabled ? "text-green-600" : "text-yellow-600"}>
              {integration.is_enabled ? "Enabled" : "Disabled"}
            </span>
          </p>
          <p className="text-sm">
            <span className="font-medium">Chat ID:</span> {integration.chat_id}
          </p>
          <p className="text-sm text-muted-foreground">Bot token is configured (hidden for security)</p>
        </div>
      </CardContent>
    </Card>
  )
}

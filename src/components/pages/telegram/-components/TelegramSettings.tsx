import type { TelegramIntegration } from "@/types"
import { IntegrationStatus } from "./IntegrationStatus"
import { UpdateIntegrationSettings } from "./UpdateIntegrationSettings"
import { NotificationTemplates } from "./NotificationTemplates"
import { DeleteTelegramIntegration } from "./DeleteTelegramIntegration"

export function TelegramSettings({ slug, integration }: { slug: string; integration: TelegramIntegration }) {
  return (
    <div className="space-y-6">
      <IntegrationStatus slug={slug} integration={integration} />
      <UpdateIntegrationSettings slug={slug} integration={integration} />
      <NotificationTemplates slug={slug} integration={integration} />
      <DeleteTelegramIntegration slug={slug} />
    </div>
  )
}

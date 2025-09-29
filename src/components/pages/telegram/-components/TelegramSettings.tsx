import type { TelegramIntegration } from "@/types"
import { IntegrationStatus } from "./IntegrationStatus"
import { UpdateIntegrationSettings } from "./UpdateIntegrationSettings"

export function TelegramSettings({ slug, integration }: { slug: string; integration: TelegramIntegration }) {
  return (
    <div className="space-y-6">
      <IntegrationStatus integration={integration} />
      <UpdateIntegrationSettings slug={slug} integration={integration} />
    </div>
  )
}

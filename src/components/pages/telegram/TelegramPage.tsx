import { useParams } from "react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { cache } from "@/hooks/useCache"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"
import { CreateTelegramIntegration } from "./-components/CreateTelegramIntegration"
import { TelegramSettings } from "./-components/TelegramSettings"

export default function TelegramPage() {
  const { slug } = useParams() as { slug: string }
  const space = cache.useSpace(slug)
  const { data: integration } = useSuspenseQuery(api.queries.telegramIntegration(slug))

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <SpacePageHeader space={space} section={integration ? "Telegram Integration" : "Create Telegram Integration"} />

      {integration ? <TelegramSettings slug={slug} integration={integration} /> : <CreateTelegramIntegration slug={slug} />}
    </div>
  )
}

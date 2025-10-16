import { useParams } from "react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { cache } from "@/hooks/useCache"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"
import { Upload } from "./-components/Upload"
import { Attachments } from "./-components/Attachments"

export default function AttachmentsPage() {
  const { slug, number } = useParams() as { slug: string; number: string }
  const space = cache.useSpace(slug)
  const { data: note } = useSuspenseQuery(api.queries.spaceNote(slug, Number(number)))

  return (
    <div className="container mx-auto px-4 py-8">
      <SpacePageHeader space={space} section={`Note #${String(note.number)} - Attachments`} />

      <div className="space-y-6">
        <Upload slug={slug} noteNumber={Number(number)} />
        <Attachments slug={slug} noteNumber={Number(number)} />
      </div>
    </div>
  )
}

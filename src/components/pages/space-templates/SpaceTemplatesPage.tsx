import { useParams } from "react-router"
import { cache } from "@/hooks/useCache"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"
import { NoteDetailTemplateEditor } from "./-components/NoteDetailTemplate"
import { NoteListTemplateEditor } from "./-components/NoteListTemplate"

export default function SpaceTemplatesPage() {
  const { slug } = useParams() as { slug: string }
  const space = cache.useSpace(slug)

  return (
    <div className="container mx-auto px-4 py-8">
      <SpacePageHeader space={space} section="Templates" />

      <div className="space-y-6">
        <NoteListTemplateEditor space={space} />
        <NoteDetailTemplateEditor space={space} />
      </div>
    </div>
  )
}

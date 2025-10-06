import { useParams, useNavigate } from "react-router"
import { cache } from "@/hooks/useCache"
import { DeleteSpace } from "./-components/DeleteSpace"
import { ListFieldsSettings } from "./-components/ListFieldsSettings"
import { HiddenCreateFieldsSettings } from "./-components/HiddenCreateFieldsSettings"
import { CommentEditableFieldsSettings } from "./-components/CommentEditableFieldsSettings"
import { UpdateSpaceTitle } from "./-components/UpdateSpaceTitle"
import { UpdateSpaceSlug } from "./-components/UpdateSpaceSlug"
import { UpdateSpaceDescription } from "./-components/UpdateSpaceDescription"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"
import { useEffect } from "react"

export default function SpaceSettingsPage() {
  const { slug } = useParams() as { slug: string }
  const navigate = useNavigate()
  const spaces = cache.useSpaces()

  // Check if space exists in cache to handle deletion scenario
  // When a space is deleted, the cache is invalidated and refetched
  // This component may still be rendered during that transition
  // Without this check, useSpace() hook would throw an error
  const space = spaces.find((s) => s.slug === slug)

  useEffect(() => {
    if (!space) {
      void navigate("/")
    }
  }, [space, navigate])

  // Prevent rendering if space doesn't exist (e.g., after deletion)
  // This avoids React errors during the navigation transition
  if (!space) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SpacePageHeader space={space} section="Settings" />

      <div className="space-y-8">
        <UpdateSpaceTitle space={space} />
        <UpdateSpaceSlug space={space} />
        <UpdateSpaceDescription space={space} />
        <ListFieldsSettings space={space} />
        <HiddenCreateFieldsSettings space={space} />
        <CommentEditableFieldsSettings space={space} />
        <DeleteSpace slug={slug} title={space.title} />
      </div>
    </div>
  )
}

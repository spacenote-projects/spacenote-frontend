import { useParams } from "react-router"
import { useSpace } from "@/hooks/useCache"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"

export default function FiltersPage() {
  const { slug } = useParams() as { slug: string }
  const space = useSpace(slug)

  return (
    <div className="container mx-auto px-4 py-8">
      <SpacePageHeader space={space} section="Filters" />
      <div className="text-center text-muted-foreground">
        <p>Filters Page - Under Construction</p>
      </div>
    </div>
  )
}

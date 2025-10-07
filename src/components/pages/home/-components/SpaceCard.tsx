import { Link } from "react-router"
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card"
import { SpaceActionsDropdown } from "@/components/shared/SpaceActionsDropdown"
import type { Space } from "@/types"

export function SpaceCard({ space }: { space: Space }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link
            to={`/s/${space.slug}${space.default_filter ? `?filter=${space.default_filter}` : ""}`}
            className="hover:underline"
          >
            {space.title}
          </Link>
        </CardTitle>
        {space.description && <CardDescription>{space.description}</CardDescription>}
        <CardAction>
          <SpaceActionsDropdown space={space} />
        </CardAction>
      </CardHeader>
    </Card>
  )
}

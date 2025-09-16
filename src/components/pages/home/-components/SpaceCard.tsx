import { Link } from "react-router"
import { Card, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { SpaceActionsDropdown } from "@/components/shared/SpaceActionsDropdown"
import type { Space } from "@/types"

export function SpaceCard({ space }: { space: Space }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link to={`/s/${space.slug}`} className="hover:underline">
            {space.title}
          </Link>
        </CardTitle>
        <CardAction>
          <SpaceActionsDropdown space={space} />
        </CardAction>
      </CardHeader>
    </Card>
  )
}

import type { ReactNode } from "react"
import { Link } from "react-router"
import type { Space } from "@/types"

interface SpacePageHeaderProps {
  space: Space
  section?: string
  actions?: ReactNode
}

export function SpacePageHeader({ space, section, actions }: SpacePageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-medium">
          {section ? (
            <>
              <Link to={`/s/${space.slug}`} className="hover:underline">
                {space.title}
              </Link>{" "}
              <span className="text-muted-foreground">/</span> {section}
            </>
          ) : (
            <Link to={`/s/${space.slug}`} className="hover:underline">
              {space.title}
            </Link>
          )}
        </h1>
      </div>
      {actions && <div>{actions}</div>}
    </div>
  )
}

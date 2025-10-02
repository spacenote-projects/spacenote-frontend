import type { ReactNode } from "react"
import { Link } from "react-router"
import type { Space } from "@/types"

interface SpacePageHeaderProps {
  space: Space
  section?: string
  actions?: ReactNode
  subtitle?: string
}

export function SpacePageHeader({ space, section, actions, subtitle }: SpacePageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
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
      {subtitle && <div className="mt-2 text-sm text-muted-foreground">{subtitle}</div>}
    </div>
  )
}

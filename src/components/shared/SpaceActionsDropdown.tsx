import { Link } from "react-router"
import { Settings } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import type { Space } from "@/types"

export function SpaceActionsDropdown({ space }: { space: Space }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="size-4" />
          <span className="sr-only">Space settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to={`/s/${space.slug}/members`}>Members ({space.members.length})</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/s/${space.slug}/fields`}>Fields ({space.fields.length})</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/s/${space.slug}/filters`}>Filters ({space.filters.length})</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/s/${space.slug}/templates`}>Templates</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/s/${space.slug}/export`}>Export</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/s/${space.slug}/telegram`}>Telegram</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/s/${space.slug}/settings`}>Settings</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

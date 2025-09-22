import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Space } from "@/types"

interface FilterSelectorProps {
  space: Space
  currentFilter?: string
  onFilterChange: (filter: string | null) => void
}

export function FilterSelector({ space, currentFilter, onFilterChange }: FilterSelectorProps) {
  const activeFilter = space.filters.find((f) => f.name === currentFilter)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          {activeFilter ? activeFilter.title : "All Notes"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        <DropdownMenuLabel>Filter Notes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            onFilterChange(null)
          }}
          className={!currentFilter ? "bg-accent" : ""}
        >
          <div className="flex flex-col">
            <span>All Notes</span>
            <span className="text-xs text-muted-foreground">Show all notes in this space</span>
          </div>
        </DropdownMenuItem>
        {space.filters.map((filter) => (
          <DropdownMenuItem
            key={filter.name}
            onClick={() => {
              onFilterChange(filter.name)
            }}
            className={currentFilter === filter.name ? "bg-accent" : ""}
          >
            <div className="flex flex-col">
              <span>{filter.title}</span>
              {filter.description && <span className="text-xs text-muted-foreground">{filter.description}</span>}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

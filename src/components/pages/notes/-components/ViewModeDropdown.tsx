import { Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface ViewModeDropdownProps {
  hasTemplate: boolean
  currentView: "default" | "template" | "json"
  onViewChange: (view: "default" | "template" | "json") => void
}

export function ViewModeDropdown({ hasTemplate, currentView, onViewChange }: ViewModeDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="size-4" />
          <span className="sr-only">View settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            onViewChange("default")
          }}
        >
          View as Default {currentView === "default" && "✓"}
        </DropdownMenuItem>
        {hasTemplate && (
          <DropdownMenuItem
            onClick={() => {
              onViewChange("template")
            }}
          >
            View as Template {currentView === "template" && "✓"}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => {
            onViewChange("json")
          }}
        >
          View as JSON {currentView === "json" && "✓"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

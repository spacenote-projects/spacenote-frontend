import { useParams, Link, useSearchParams } from "react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { cache } from "@/hooks/useCache"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"
import { SpaceActionsDropdown } from "@/components/shared/SpaceActionsDropdown"
import { NotePaginator } from "./-components/NotePaginator"
import { DefaultNotesView } from "./-components/DefaultNotesView"
import { TemplateNotesView } from "./-components/TemplateNotesView"
import { FilterSelector } from "./-components/FilterSelector"
const DEFAULT_LIMIT = 50

export default function NotesPage() {
  const { slug } = useParams() as { slug: string }
  const space = cache.useSpace(slug)

  // URL state management (formerly useNotePagination)
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const limit = Math.max(1, Number(searchParams.get("limit")) || DEFAULT_LIMIT)
  const filter = searchParams.get("filter") ?? undefined

  const updateParams = (updates: { page?: number; limit?: number; filter?: string | null }) => {
    const newParams = new URLSearchParams(searchParams)

    // Handle page update
    if (updates.page !== undefined) {
      if (updates.page === 1) {
        newParams.delete("page")
      } else {
        newParams.set("page", String(updates.page))
      }
    }

    // Handle limit update
    if (updates.limit !== undefined) {
      // Reset to page 1 when changing limit
      newParams.delete("page")

      if (updates.limit === DEFAULT_LIMIT) {
        newParams.delete("limit")
      } else {
        newParams.set("limit", String(updates.limit))
      }
    }

    // Handle filter update
    if (updates.filter !== undefined) {
      // Reset to page 1 when changing filter
      newParams.delete("page")

      if (updates.filter === null) {
        newParams.delete("filter")
      } else {
        newParams.set("filter", updates.filter)
      }
    }

    setSearchParams(newParams)
  }

  const { data: paginatedResult } = useSuspenseQuery(api.queries.spaceNotes(slug, page, limit, filter))

  const totalPages = Math.ceil(paginatedResult.total / limit)
  const validPage = Math.min(page, Math.max(1, totalPages))

  // Use validPage if page is out of bounds
  if (page !== validPage && totalPages > 0) {
    updateParams({ page: validPage })
  }

  const hasTemplate = !!space.templates.note_list

  return (
    <div className="container mx-auto px-4 py-8">
      <SpacePageHeader
        space={space}
        actions={
          <div className="flex items-center gap-2">
            {space.filters.length > 0 && (
              <FilterSelector
                space={space}
                currentFilter={filter}
                onFilterChange={(newFilter) => {
                  updateParams({ filter: newFilter })
                }}
              />
            )}
            <Button variant="outline" size="sm" asChild>
              <Link to={`/s/${slug}/new`}>
                <Plus className="mr-2 h-4 w-4" />
                New Note
              </Link>
            </Button>
            <SpaceActionsDropdown space={space} />
          </div>
        }
      />

      {paginatedResult.items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No notes yet in this space</div>
      ) : (
        <>
          {hasTemplate ? (
            <TemplateNotesView notes={paginatedResult.items} space={space} />
          ) : (
            <DefaultNotesView notes={paginatedResult.items} space={space} filter={filter} />
          )}

          {totalPages > 1 && (
            <NotePaginator
              currentPage={validPage}
              totalPages={totalPages}
              limit={limit}
              onPageChange={(newPage) => {
                updateParams({ page: newPage })
              }}
              onLimitChange={(newLimit) => {
                updateParams({ limit: newLimit })
              }}
            />
          )}
        </>
      )}
    </div>
  )
}

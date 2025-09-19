import { useParams, Link } from "react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { cache } from "@/hooks/useCache"
import { useNotePagination } from "@/hooks/useNotePagination"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"
import { SpaceActionsDropdown } from "@/components/shared/SpaceActionsDropdown"
import { NotePaginator } from "./-components/NotePaginator"
import { NotesTable } from "./-components/NotesTable"

export default function NotesPage() {
  const { slug } = useParams() as { slug: string }
  const space = cache.useSpace(slug)
  const { page, limit, updateParams } = useNotePagination()

  const { data: paginatedResult } = useSuspenseQuery(api.queries.spaceNotes(slug, page, limit))

  const totalPages = Math.ceil(paginatedResult.total / limit)
  const validPage = Math.min(page, Math.max(1, totalPages))

  // Use validPage if page is out of bounds
  if (page !== validPage && totalPages > 0) {
    updateParams({ page: validPage })
  }

  const columns = space.list_fields.length > 0 ? space.list_fields : ["number", "created_at", "author"]

  return (
    <div className="container mx-auto px-4 py-8">
      <SpacePageHeader
        space={space}
        actions={
          <div className="flex items-center gap-2">
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
          <NotesTable notes={paginatedResult.items} columns={columns} space={space} slug={slug} />

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

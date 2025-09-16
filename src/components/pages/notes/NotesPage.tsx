import { useParams, Link, useNavigate, useSearchParams } from "react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useSpace } from "@/hooks/useCache"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import NoteFieldValue from "@/components/shared/NoteFieldValue"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"
import { SpaceActionsDropdown } from "@/components/shared/SpaceActionsDropdown"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function NotesPage() {
  const { slug } = useParams() as { slug: string }
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const space = useSpace(slug)

  // Get limit from URL with validation (between 1 and 100, default 50)
  const rawLimit = Number(searchParams.get("limit"))
  const limit = rawLimit >= 1 && rawLimit <= 100 ? rawLimit : 50

  // Get current page from URL or default to 1
  let currentPage = Number(searchParams.get("page")) || 1

  const { data: paginatedResult } = useSuspenseQuery(api.queries.spaceNotes(slug, currentPage, limit))
  const notes = paginatedResult.items
  const totalPages = Math.ceil(paginatedResult.total / limit)

  // If current page is out of bounds, reset to page 1
  if (currentPage > totalPages && totalPages > 0) {
    currentPage = 1
  }

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams)

    if (page === 1) {
      newSearchParams.delete("page")
    } else {
      newSearchParams.set("page", String(page))
    }

    // Preserve limit if it's not the default
    if (limit !== 50) {
      newSearchParams.set("limit", String(limit))
    } else {
      newSearchParams.delete("limit")
    }

    setSearchParams(newSearchParams)
  }

  // Determine columns to display
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

      {notes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No notes yet in this space</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {notes.map((note) => (
                <TableRow
                  key={note.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/s/${slug}/${String(note.number)}`)}
                >
                  {columns.map((column) => (
                    <TableCell key={column}>
                      <NoteFieldValue note={note} fieldKey={column} field={space.fields.find((f) => f.name === column)} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        handlePageChange(currentPage - 1)
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 7) {
                      pageNum = i + 1
                    } else if (currentPage <= 4) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + i
                    } else {
                      pageNum = currentPage - 3 + i
                    }

                    if (pageNum < 1 || pageNum > totalPages) return null

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => {
                            handlePageChange(pageNum)
                          }}
                          isActive={pageNum === currentPage}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  }).filter(Boolean)}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        handlePageChange(currentPage + 1)
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  )
}

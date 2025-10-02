import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function NotePaginator({
  currentPage,
  limit,
  totalCount,
  onPageChange,
  onLimitChange,
}: {
  currentPage: number
  limit: number
  totalCount: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}) {
  const totalPages = Math.ceil(totalCount / limit)
  const pageSizeOptions = [10, 25, 50, 100, 200, 500]

  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground text-nowrap">Page size:</span>
        <Select
          value={String(limit)}
          onValueChange={(value) => {
            onLimitChange(Number(value))
          }}
        >
          <SelectTrigger size="sm" className="w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  onPageChange(currentPage - 1)
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
                      onPageChange(pageNum)
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
                  onPageChange(currentPage + 1)
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

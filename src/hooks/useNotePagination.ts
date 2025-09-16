import { useSearchParams } from "react-router"

const DEFAULT_LIMIT = 50

export function useNotePagination() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const limit = Math.max(1, Number(searchParams.get("limit")) || DEFAULT_LIMIT)

  const updateParams = (updates: { page?: number; limit?: number }) => {
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

    setSearchParams(newParams)
  }

  return { page, limit, updateParams }
}

import { useSuspenseQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { AppError } from "@/lib/errors"
import type { Space } from "@/types"

/**
 * Hook to get all spaces from cache
 * Spaces are loaded once on app start and cached indefinitely
 */
export function useSpaces() {
  const { data: spaces } = useSuspenseQuery(api.queries.spaces())
  return spaces
}

/**
 * Hook to get a specific space by slug from cached spaces list
 */
export function useSpace(slug: string): Space {
  const spaces = useSpaces()
  const space = spaces.find((f) => f.slug === slug)
  if (!space) {
    throw new AppError("not_found", "Space not found: " + slug)
  }
  return space
}

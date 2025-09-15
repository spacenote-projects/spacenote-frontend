import { useSuspenseQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { AppError } from "@/lib/errors"
import type { Space, User } from "@/types"

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

/**
 * Hook to get all users from cache
 * Users are loaded once on app start and cached indefinitely
 */
export function useUsers() {
  const { data: users } = useSuspenseQuery(api.queries.users())
  return users
}

/**
 * Hook to get a specific user by ID from cached users list
 */
export function useUser(id: string): User {
  const users = useUsers()
  const user = users.find((u) => u.id === id)
  if (!user) {
    throw new AppError("not_found", "User not found: " + id)
  }
  return user
}

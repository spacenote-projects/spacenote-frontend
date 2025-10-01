import { cache } from "@/hooks/useCache"

export function Username({ userId }: { userId: string }) {
  const user = cache.useUser(userId)
  return <span>👤{user.username}</span>
}

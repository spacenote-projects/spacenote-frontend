import { useUser } from "@/hooks/useCache"

export function Username({ userId }: { userId: string }) {
  const user = useUser(userId)
  return <span>{user.username}</span>
}

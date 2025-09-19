import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import { cache } from "@/hooks/useCache"

interface RemoveMemberButtonProps {
  slug: string
  memberId: string
  disabled?: boolean
}

export function RemoveMemberButton({ slug, memberId, disabled }: RemoveMemberButtonProps) {
  const users = cache.useUsers()
  const mutation = api.mutations.useRemoveMember()

  const getMemberUsername = (userId: string): string => {
    const user = users.find((u) => u.id === userId)
    return user?.username ?? userId
  }

  const username = getMemberUsername(memberId)

  const handleRemove = () => {
    if (!window.confirm(`Remove ${username} from this space?`)) return

    mutation.mutate(
      { slug, username },
      {
        onSuccess: () => {
          toast.success("Member removed successfully")
        },
      }
    )
  }

  return (
    <>
      <Button variant="destructive" size="sm" onClick={handleRemove} disabled={disabled ?? mutation.isPending}>
        {mutation.isPending ? "Removing..." : "Remove"}
      </Button>
      {mutation.error && (
        <div className="mt-2">
          <ErrorMessage error={mutation.error} />
        </div>
      )}
    </>
  )
}

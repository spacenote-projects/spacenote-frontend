import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { useState } from "react"

export function DeleteUserButton({ username, disabled }: { username: string; disabled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const mutation = api.mutations.useDeleteUser()

  const handleDelete = () => {
    mutation.mutate(username, {
      onSuccess: () => {
        toast.success(`User ${username} deleted successfully`)
        setIsOpen(false)
      },
    })
  }

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          setIsOpen(true)
        }}
        disabled={disabled}
      >
        Delete
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user "{username}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={mutation.isPending}>
              {mutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

import { useNavigate } from "react-router"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ErrorMessage } from "@/components/shared/ErrorMessage"

export function DeleteSpace({ slug, title }: { slug: string; title: string }) {
  const navigate = useNavigate()
  const mutation = api.mutations.useDeleteSpace()

  const handleDelete = () => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return

    mutation.mutate(slug, {
      onSuccess: () => {
        toast.success("Space deleted successfully")
        void navigate("/")
      },
    })
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-destructive">Danger Zone</h2>
      <div className="border border-destructive rounded-lg p-4 space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Delete this space</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete a space, there is no going back. All notes, comments, and data will be permanently deleted.
          </p>
          <Button variant="destructive" onClick={handleDelete} disabled={mutation.isPending}>
            {mutation.isPending ? "Deleting..." : "Delete Space"}
          </Button>
          {mutation.error && (
            <div className="mt-2">
              <ErrorMessage error={mutation.error} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

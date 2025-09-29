import { useNavigate } from "react-router"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ErrorMessage } from "@/components/shared/ErrorMessage"

export function DeleteTelegramIntegration({ slug }: { slug: string }) {
  const navigate = useNavigate()
  const mutation = api.mutations.useDeleteTelegramIntegration()

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete the Telegram integration? This action cannot be undone.")) {
      return
    }

    mutation.mutate(slug, {
      onSuccess: () => {
        toast.success("Telegram integration deleted successfully")
        void navigate(`/s/${slug}/telegram`)
      },
    })
  }

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">Delete Integration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Once you delete the Telegram integration, all notification settings and configurations will be permanently removed. You
          can set up a new integration at any time.
        </p>

        <Button variant="destructive" onClick={handleDelete} disabled={mutation.isPending}>
          {mutation.isPending ? "Deleting..." : "Delete Telegram Integration"}
        </Button>

        {mutation.error && <ErrorMessage error={mutation.error} />}
      </CardContent>
    </Card>
  )
}

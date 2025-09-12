import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ErrorMessage({ error }: { error: unknown }) {
  if (!error) return null

  let message = "Error!"
  if (typeof error === "object" && "message" in error) {
    message = `Error! ${String(error.message)}`
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

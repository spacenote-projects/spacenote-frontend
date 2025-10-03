import { useState } from "react"
import type { TelegramIntegration } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { api } from "@/lib/api"

export function IntegrationStatus({ slug, integration }: { slug: string; integration: TelegramIntegration }) {
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const testMutation = api.mutations.useTestTelegramIntegration()

  const handleTest = () => {
    setTestResult(null)
    testMutation.mutate(slug, {
      onSuccess: (data) => {
        const errors = Object.entries(data).filter(([, error]) => error !== null)
        const allSuccessful = errors.length === 0

        if (allSuccessful) {
          setTestResult({
            success: true,
            message: "All test messages sent successfully!",
          })
        } else {
          const errorMessages = errors.map(([event, error]) => `${event}: ${error ?? ""}`).join(", ")
          setTestResult({
            success: false,
            message: errorMessages,
          })
        }
      },
      onError: (error) => {
        setTestResult({
          success: false,
          message: error instanceof Error ? error.message : "Failed to test integration",
        })
      },
    })
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Status:</span>{" "}
            <span className={integration.is_enabled ? "text-green-600" : "text-yellow-600"}>
              {integration.is_enabled ? "Enabled" : "Disabled"}
            </span>
          </p>
          <p className="text-sm">
            <span className="font-medium">Chat ID:</span> {integration.chat_id}
          </p>
          <p className="text-sm text-muted-foreground">Bot token is configured at the project level</p>
        </div>
        <div className="mt-4">
          <Button onClick={handleTest} disabled={testMutation.isPending || !integration.is_enabled} variant="outline">
            {testMutation.isPending ? "Testing..." : "Test Integration"}
          </Button>
        </div>
        {testResult && (
          <Alert className={`mt-4 ${testResult.success ? "" : "border-red-500"}`}>
            <AlertDescription className={testResult.success ? "text-green-600" : "text-red-600"}>
              {testResult.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

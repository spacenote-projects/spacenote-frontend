import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { LLMLog } from "@/types"
import { formatDateTime } from "@/lib/formatters"

interface LLMLogDetailsDialogProps {
  log: LLMLog | null
  open: boolean
  onOpenChange: (open: boolean) => void
  username: string
}

export default function LLMLogDetailsDialog({ log, open, onOpenChange, username }: LLMLogDetailsDialogProps) {
  if (!log) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>LLM Log Details</DialogTitle>
          <DialogDescription>Detailed information about the LLM API interaction</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-semibold mb-2">General Information</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 text-gray-600 w-1/3">ID</td>
                  <td className="py-2 font-mono text-xs break-all">{log.id}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Created At</td>
                  <td className="py-2">{formatDateTime(log.created_at)}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">User</td>
                  <td className="py-2">👤{username}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Model</td>
                  <td className="py-2 font-mono">{log.model}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Operation Type</td>
                  <td className="py-2">{log.operation_type ?? "-"}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Space ID</td>
                  <td className="py-2 font-mono text-xs break-all">{log.space_id ?? "-"}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h3 className="text-sm font-semibold mb-2">Request</h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-600 mb-1">User Input</div>
                <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap break-words">{log.user_input}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">System Prompt</div>
                <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap break-words max-h-60 overflow-y-auto">
                  {log.system_prompt}
                </div>
              </div>
              {log.context_data && (
                <div>
                  <div className="text-xs text-gray-600 mb-1">Context Data</div>
                  <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto max-h-60">
                    {JSON.stringify(log.context_data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold mb-2">Response</h3>
            <div className="space-y-3">
              {log.llm_response ? (
                <div>
                  <div className="text-xs text-gray-600 mb-1">LLM Response</div>
                  <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap break-words max-h-60 overflow-y-auto">
                    {log.llm_response}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No response</div>
              )}
              {log.parsed_response && (
                <div>
                  <div className="text-xs text-gray-600 mb-1">Parsed Response</div>
                  <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto max-h-60">
                    {JSON.stringify(log.parsed_response, null, 2)}
                  </pre>
                </div>
              )}
              {log.error_message && (
                <div>
                  <div className="text-xs text-gray-600 mb-1">Error Message</div>
                  <div className="bg-red-50 p-3 rounded text-sm text-red-700 whitespace-pre-wrap break-words">
                    {log.error_message}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold mb-2">Performance Metrics</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 text-gray-600 w-1/3">Duration</td>
                  <td className="py-2">{log.duration_ms}ms</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Prompt Tokens</td>
                  <td className="py-2">{log.prompt_tokens ?? "-"}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Completion Tokens</td>
                  <td className="py-2">{log.completion_tokens ?? "-"}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Total Tokens</td>
                  <td className="py-2 font-semibold">{log.total_tokens ?? "-"}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

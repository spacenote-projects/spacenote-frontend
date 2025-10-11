import { useState } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { cache } from "@/hooks/useCache"
import { api } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AppError } from "@/lib/errors"
import { formatDateTime } from "@/lib/formatters"
import type { LLMLog } from "@/types"
import LLMLogDetailsDialog from "./-components/LLMLogDetailsDialog"

export default function LLMLogsPage() {
  const currentUser = cache.useCurrentUser()
  const users = cache.useUsers()
  const [selectedLog, setSelectedLog] = useState<LLMLog | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  if (currentUser.username !== "admin") {
    throw new AppError("forbidden", "This page is only accessible to administrators")
  }

  const { data: paginatedResult } = useSuspenseQuery(api.queries.llmLogs())
  const logs = paginatedResult.items

  const getUsernameById = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user ? user.username : userId
  }

  const handleRowClick = (log: LLMLog) => {
    setSelectedLog(log)
    setDialogOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">LLM Logs</h1>

      {logs.length === 0 ? (
        <p className="text-muted-foreground">No LLM logs found</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Created At</TableHead>
              <TableHead>User</TableHead>
              <TableHead>User Input</TableHead>
              <TableHead>Error Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow
                key={log.id}
                onClick={() => {
                  handleRowClick(log)
                }}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell className="font-medium">{formatDateTime(log.created_at)}</TableCell>
                <TableCell>👤{getUsernameById(log.user_id)}</TableCell>
                <TableCell className="whitespace-normal break-words">{log.user_input}</TableCell>
                <TableCell className="whitespace-normal break-words">{log.error_message ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <LLMLogDetailsDialog
        log={selectedLog}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        username={selectedLog ? getUsernameById(selectedLog.user_id) : ""}
      />
    </div>
  )
}

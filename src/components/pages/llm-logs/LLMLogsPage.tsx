import { useSuspenseQuery } from "@tanstack/react-query"
import { cache } from "@/hooks/useCache"
import { api } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AppError } from "@/lib/errors"
import { formatDateTime } from "@/lib/formatters"

export default function LLMLogsPage() {
  const currentUser = cache.useCurrentUser()
  const users = cache.useUsers()

  if (currentUser.username !== "admin") {
    throw new AppError("forbidden", "This page is only accessible to administrators")
  }

  const { data: paginatedResult } = useSuspenseQuery(api.queries.llmLogs())
  const logs = paginatedResult.items

  const getUsernameById = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user ? user.username : userId
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
              <TableRow key={log.id}>
                <TableCell className="font-medium">{formatDateTime(log.created_at)}</TableCell>
                <TableCell>👤{getUsernameById(log.user_id)}</TableCell>
                <TableCell className="whitespace-normal break-words">{log.user_input}</TableCell>
                <TableCell className="whitespace-normal break-words">{log.error_message ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

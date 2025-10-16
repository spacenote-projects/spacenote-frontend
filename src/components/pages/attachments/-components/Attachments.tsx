import { Suspense } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { formatFileSize, formatDateTime } from "@/lib/formatters"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Username } from "@/components/shared/Username"

function getApiUrl(): string {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL
  }
  return window.__SPACENOTE_CONFIG__?.API_URL ?? ""
}

function AttachmentList({ slug, noteNumber }: { slug: string; noteNumber: number }) {
  const { data: attachments } = useSuspenseQuery(api.queries.noteAttachments(slug, noteNumber))

  if (attachments.length === 0) {
    return <p className="text-muted-foreground">No attachments yet</p>
  }

  const apiUrl = getApiUrl()

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => {
        const downloadUrl = `${apiUrl}/api/v1/spaces/${slug}/attachments/${String(attachment.number)}`

        return (
          <div key={attachment.id} className="flex items-center justify-between p-3 border rounded">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{attachment.filename}</p>
              <p className="text-sm text-muted-foreground">
                <Username userId={attachment.user_id} /> • {attachment.mime_type} • {formatFileSize(attachment.size)} •{" "}
                {formatDateTime(attachment.created_at)}
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={downloadUrl} download>
                <Download className="size-4 mr-2" />
                Download
              </a>
            </Button>
          </div>
        )
      })}
    </div>
  )
}

export function Attachments({ slug, noteNumber }: { slug: string; noteNumber: number }) {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Attachments</h2>
      <Suspense fallback={<div>Loading attachments...</div>}>
        <AttachmentList slug={slug} noteNumber={noteNumber} />
      </Suspense>
    </div>
  )
}

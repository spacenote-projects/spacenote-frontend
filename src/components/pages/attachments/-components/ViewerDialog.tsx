import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Attachment } from "@/types"
import { isBrowserUnsupportedImage } from "@/lib/formatters"
import { ImageViewer } from "./ImageViewer"
import { PdfViewer } from "./PdfViewer"
import { TextViewer } from "./TextViewer"

function getApiUrl(): string {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL
  }
  return window.__SPACENOTE_CONFIG__?.API_URL ?? ""
}

export function ViewerDialog({
  slug,
  attachment,
  open,
  onOpenChange,
}: {
  slug: string
  attachment: Attachment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!attachment) return null

  const apiUrl = getApiUrl()
  const formatParam = isBrowserUnsupportedImage(attachment.mime_type) ? "?format=webp" : ""
  const viewUrl = `${apiUrl}/api/v1/spaces/${slug}/attachments/${String(attachment.number)}${formatParam}`

  const isImage = attachment.mime_type.startsWith("image/")
  const isPdf = attachment.mime_type === "application/pdf"
  const isText = attachment.mime_type.startsWith("text/")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[95vw] w-auto max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{attachment.filename}</DialogTitle>
          <DialogDescription>Preview of attachment</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {isImage && <ImageViewer url={viewUrl} filename={attachment.filename} />}
          {isPdf && <PdfViewer url={viewUrl} filename={attachment.filename} />}
          {isText && <TextViewer slug={slug} attachmentNumber={attachment.number} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}

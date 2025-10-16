import { useState } from "react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import { toast } from "sonner"

export function Upload({ slug, noteNumber }: { slug: string; noteNumber: number }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const mutation = api.mutations.useUploadAttachment()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setSelectedFile(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      toast.error("Please select a file")
      return
    }

    mutation.mutate(
      { slug, noteNumber, file: selectedFile },
      {
        onSuccess: () => {
          toast.success("File uploaded successfully")
          setSelectedFile(null)
          const fileInput = document.getElementById("file-input") as HTMLInputElement | null
          if (fileInput) {
            fileInput.value = ""
          }
        },
      }
    )
  }

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Upload Attachment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input id="file-input" type="file" onChange={handleFileChange} />
        </div>

        {mutation.error && <ErrorMessage error={mutation.error} />}

        <Button type="submit" disabled={mutation.isPending || !selectedFile}>
          {mutation.isPending ? "Uploading..." : "Upload"}
        </Button>
      </form>
    </div>
  )
}

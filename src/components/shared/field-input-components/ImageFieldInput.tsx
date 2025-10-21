import type { Control } from "react-hook-form"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { api } from "@/lib/api"
import type { SpaceField, Space } from "@/types"
import { isBrowserUnsupportedImage } from "@/lib/formatters"

function getApiUrl(): string {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL
  }
  return window.__SPACENOTE_CONFIG__?.API_URL ?? ""
}

interface ImageFieldInputProps {
  field: SpaceField
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
  space: Space
  onChange?: (fieldName: string) => void
}

export default function ImageFieldInput({ field, control, name, space, onChange }: ImageFieldInputProps) {
  const uploadMutation = api.mutations.useUploadAttachment()
  const [previewUrl, setPreviewUrl] = useState<string>()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, formField: { onChange: (value: string) => void }) => {
    const file = e.target.files?.[0]
    if (!file) return

    uploadMutation.mutate(
      { slug: space.slug, file },
      {
        onSuccess: (attachment) => {
          formField.onChange(attachment.id)

          if (isBrowserUnsupportedImage(file.type)) {
            const apiUrl = getApiUrl()
            const serverUrl = `${apiUrl}/api/v1/spaces/${space.slug}/attachments/${String(attachment.number)}?format=webp&option=max_width:400`
            setPreviewUrl(serverUrl)
          } else {
            setPreviewUrl(URL.createObjectURL(file))
          }
          if (onChange) {
            onChange(name)
          }
        },
      }
    )
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel>
            {field.id}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleFileChange(e, formField)
                }}
                disabled={uploadMutation.isPending}
              />
              {uploadMutation.isPending && <p className="text-sm text-muted-foreground">Uploading...</p>}
              {previewUrl && (
                <div className="mt-2">
                  <img src={previewUrl} alt="Preview" className="max-w-xs max-h-48 rounded border" />
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

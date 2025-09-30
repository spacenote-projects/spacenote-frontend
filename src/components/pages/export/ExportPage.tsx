import { useState } from "react"
import { useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { Copy } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { cache } from "@/hooks/useCache"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function ExportPage() {
  const { slug } = useParams() as { slug: string }
  const [includeData, setIncludeData] = useState(false)
  const space = cache.useSpace(slug)
  const { data } = useQuery(api.queries.spaceExport(slug, includeData))

  const handleCopy = async () => {
    if (!data) return
    const jsonString = JSON.stringify(data, null, 2)
    await navigator.clipboard.writeText(jsonString)
    toast.success("Copied to clipboard")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SpacePageHeader space={space} section="Export" />

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="include-data"
            checked={includeData}
            onCheckedChange={(checked) => {
              setIncludeData(checked === true)
            }}
          />
          <Label htmlFor="include-data">Include notes and comments data</Label>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {includeData
              ? "Full export with space configuration, notes, and comments in JSON format"
              : "Space configuration export in JSON format"}
          </p>
          <Button onClick={handleCopy} size="sm" disabled={!data}>
            <Copy className="size-4 mr-2" />
            Copy to clipboard
          </Button>
        </div>

        {data && (
          <div className="relative">
            <pre className="border rounded-lg p-4 overflow-auto max-h-[600px] bg-muted/30">
              <code className="text-sm">{JSON.stringify(data, null, 2)}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

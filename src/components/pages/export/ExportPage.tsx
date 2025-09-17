import { useParams } from "react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Copy } from "lucide-react"
import { api } from "@/lib/api"
import { useSpace } from "@/hooks/useCache"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"
import { Button } from "@/components/ui/button"

export default function ExportPage() {
  const { slug } = useParams() as { slug: string }
  const space = useSpace(slug)
  const { data } = useSuspenseQuery(api.queries.spaceExport(slug))

  const handleCopy = async () => {
    const jsonString = JSON.stringify(data, null, 2)
    await navigator.clipboard.writeText(jsonString)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SpacePageHeader space={space} section="Export" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Space configuration export in JSON format</p>
          <Button onClick={handleCopy} size="sm">
            <Copy className="size-4 mr-2" />
            Copy to clipboard
          </Button>
        </div>

        <div className="relative">
          <pre className="border rounded-lg p-4 overflow-auto max-h-[600px] bg-muted/30">
            <code className="text-sm">{JSON.stringify(data, null, 2)}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

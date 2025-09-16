import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import MarkdownDisplay from "@/components/shared/MarkdownDisplay"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function MarkdownEditor({ value, onChange, placeholder, className }: MarkdownEditorProps) {
  return (
    <Tabs defaultValue="edit" className={className}>
      <TabsList>
        <TabsTrigger value="edit">Edit</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="edit">
        <Textarea
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
          }}
          placeholder={placeholder}
          className="min-h-[200px]"
        />
      </TabsContent>
      <TabsContent value="preview">
        <div className="min-h-[200px] rounded-md border px-3 py-2">
          {value ? (
            <MarkdownDisplay content={value} />
          ) : (
            <p className="text-muted-foreground">{placeholder ?? "Nothing to preview"}</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}

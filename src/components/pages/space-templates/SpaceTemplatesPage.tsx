import { useParams } from "react-router"
import { cache } from "@/hooks/useCache"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"
import { TemplateEditor } from "./-components/TemplateEditor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SpaceTemplatesPage() {
  const { slug } = useParams() as { slug: string }
  const space = cache.useSpace(slug)

  return (
    <div className="container mx-auto px-4 py-8">
      <SpacePageHeader space={space} section="Templates" />

      <Card>
        <CardHeader>
          <CardTitle>Display Templates</CardTitle>
          <p className="text-sm text-muted-foreground">Customize how notes are displayed using Liquid template syntax</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="detail">Detail View</TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              <TemplateEditor
                space={space}
                templateName="note_list"
                label="Note List Template"
                description="Customize how notes appear in list views. Use Liquid template syntax to access note fields."
                placeholder="Example: {{ note.title }} - {{ note.status }}"
              />
            </TabsContent>

            <TabsContent value="detail">
              <TemplateEditor
                space={space}
                templateName="note_detail"
                label="Note Detail Template"
                description="Customize how individual notes are displayed. Use Liquid template syntax to access note fields."
                placeholder="Example: {{ note.title }}"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

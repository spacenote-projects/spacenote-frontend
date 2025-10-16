import { useParams, useNavigate, useSearchParams } from "react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"
import { api } from "@/lib/api"
import { cache } from "@/hooks/useCache"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CommentForm } from "./-components/CommentForm"
import { CommentList } from "./-components/CommentList"
import { DefaultNoteView } from "./-components/DefaultNoteView"
import { TemplateNoteView } from "./-components/TemplateNoteView"
import { JSONNoteView } from "./-components/JSONNoteView"

export default function NotePage() {
  const { slug, number } = useParams() as { slug: string; number: string }
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const space = cache.useSpace(slug)
  const { data: note } = useSuspenseQuery(api.queries.spaceNote(slug, Number(number)))

  const viewMode = searchParams.get("view")
  const hasTemplate = Boolean(space.templates.note_detail)

  const NoteView =
    viewMode === "default"
      ? DefaultNoteView
      : viewMode === "json"
        ? JSONNoteView
        : viewMode === "template" || (!viewMode && hasTemplate)
          ? TemplateNoteView
          : DefaultNoteView

  // Check which view is actually being shown
  const isShowingDefault = NoteView === DefaultNoteView
  const isShowingTemplate = NoteView === TemplateNoteView
  const isShowingJSON = NoteView === JSONNoteView

  const handleViewChange = (view: "default" | "template" | "json") => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set("view", view)
    setSearchParams(newParams)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SpacePageHeader
        space={space}
        section={`Note #${String(note.number)}`}
        actions={
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate(`/s/${slug}/${number}/edit`)}>Edit</Button>
            <Button onClick={() => navigate(`/s/${slug}/${number}/attachments`)}>Attachments</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Eye className="size-4" />
                  <span className="sr-only">View settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    handleViewChange("default")
                  }}
                >
                  View as Default {isShowingDefault && "✓"}
                </DropdownMenuItem>
                {hasTemplate && (
                  <DropdownMenuItem
                    onClick={() => {
                      handleViewChange("template")
                    }}
                  >
                    View as Template {isShowingTemplate && "✓"}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => {
                    handleViewChange("json")
                  }}
                >
                  View as JSON {isShowingJSON && "✓"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <NoteView note={note} space={space} />

      <div className="mt-8 space-y-6">
        <h2 className="text-xl font-semibold">Comments</h2>

        <div className="border rounded-lg p-4">
          <CommentForm slug={slug} noteNumber={Number(number)} space={space} note={note} />
        </div>

        <Suspense fallback={<div>Loading comments...</div>}>
          <CommentList slug={slug} noteNumber={Number(number)} />
        </Suspense>
      </div>
    </div>
  )
}

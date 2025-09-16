import { useParams, Link } from "react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useSpace } from "@/hooks/useCache"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import NoteFieldValue from "@/components/shared/NoteFieldValue"

export default function NotePage() {
  const { slug, number } = useParams() as { slug: string; number: string }
  const space = useSpace(slug)
  const { data: note } = useSuspenseQuery(api.queries.spaceNote(slug, Number(number)))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/s/${slug}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to notes
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Note #{note.number}</h1>
        <p className="text-muted-foreground">{space.title}</p>
      </div>

      <div className="space-y-4">
        {space.fields.map((field) => (
          <div key={field.name} className="border rounded-lg p-4">
            <div className="font-medium mb-2">{field.name}</div>
            <div className="text-sm">
              <NoteFieldValue note={note} fieldKey={field.name} field={field} />
            </div>
          </div>
        ))}

        <div className="border rounded-lg p-4">
          <div className="font-medium mb-2">Created</div>
          <div className="text-sm">
            <NoteFieldValue note={note} fieldKey="created_at" />
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="font-medium mb-2">Author</div>
          <div className="text-sm">
            <NoteFieldValue note={note} fieldKey="author" />
          </div>
        </div>
      </div>
    </div>
  )
}

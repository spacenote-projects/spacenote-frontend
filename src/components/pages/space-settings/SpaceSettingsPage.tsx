import { useParams } from "react-router"
import { useSpace } from "@/hooks/useCache"
import { DeleteSpace } from "./-components/DeleteSpace"

export default function SpaceSettingsPage() {
  const { slug } = useParams() as { slug: string }
  const space = useSpace(slug)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Settings - {space.title}</h1>

      <div className="space-y-8">
        {/* General Settings Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">General</h2>
          <div className="border rounded-lg p-4">
            <p className="text-muted-foreground">Space settings will be available here soon.</p>
          </div>
        </section>

        <DeleteSpace slug={slug} title={space.title} />
      </div>
    </div>
  )
}

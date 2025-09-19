import { cache } from "@/hooks/useCache"
import { SpaceCard } from "./-components/SpaceCard"

export default function HomePage() {
  const spaces = cache.useSpaces()

  if (spaces.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground">
          <p>No spaces available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {spaces.map((space) => (
          <SpaceCard key={space.slug} space={space} />
        ))}
      </div>
    </div>
  )
}

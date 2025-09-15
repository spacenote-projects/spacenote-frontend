import { useParams } from "react-router"

export default function SpaceTemplatesPage() {
  const { slug } = useParams() as { slug: string }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Templates - {slug}</h1>
      <div className="text-center text-muted-foreground">
        <p>Templates Page - Under Construction</p>
      </div>
    </div>
  )
}

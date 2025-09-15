import { useParams } from "react-router"

export default function SpaceDetailPage() {
  const { slug } = useParams() as { slug: string }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Space: {slug}</h1>
    </div>
  )
}

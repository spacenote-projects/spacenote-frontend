import { useParams } from "react-router"
import { useSpace } from "@/hooks/useCache"
import { Username } from "@/components/shared/Username"

export default function MembersPage() {
  const { slug } = useParams() as { slug: string }
  const space = useSpace(slug)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Members</h1>

      {space.members.length === 0 ? (
        <p className="text-muted-foreground">No members in this space</p>
      ) : (
        <div className="space-y-2">
          {space.members.map((memberId) => (
            <div key={memberId} className="p-3 border rounded">
              <Username userId={memberId} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

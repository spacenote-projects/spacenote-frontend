import { useParams } from "react-router"
import { useSpace } from "@/hooks/useCache"
import { Username } from "@/components/shared/Username"
import { AddMemberForm } from "./-components/AddMemberForm"
import { RemoveMemberButton } from "./-components/RemoveMemberButton"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"

export default function MembersPage() {
  const { slug } = useParams() as { slug: string }
  const space = useSpace(slug)

  return (
    <div className="container mx-auto px-4 py-8">
      <SpacePageHeader space={space} section="Members" />

      <div className="mb-6">
        <AddMemberForm slug={slug} />
      </div>

      {space.members.length === 0 ? (
        <p className="text-muted-foreground">No members in this space</p>
      ) : (
        <div className="space-y-2">
          {space.members.map((memberId) => (
            <div key={memberId} className="p-3 border rounded flex items-center justify-between">
              <Username userId={memberId} />
              <RemoveMemberButton slug={slug} memberId={memberId} disabled={space.members.length === 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

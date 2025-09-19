import { cache } from "@/hooks/useCache"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function UsersPage() {
  const currentUser = cache.useCurrentUser()
  const users = cache.useUsers()
  const spaces = cache.useSpaces()

  const isAdmin = currentUser.username === "admin"

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Access Denied</h1>
        <p className="text-muted-foreground">This page is only accessible to administrators.</p>
      </div>
    )
  }

  const getUserSpaces = (userId: string): string[] => {
    return spaces.filter((space) => space.members.includes(userId)).map((space) => space.slug)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {users.length === 0 ? (
        <p className="text-muted-foreground">No users found</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Spaces</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const userSpaces = getUserSpaces(user.id)
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>
                    {userSpaces.length === 0 ? (
                      <span className="text-muted-foreground">No spaces</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {userSpaces.map((slug) => (
                          <span key={slug} className="px-2 py-1 text-xs bg-muted rounded">
                            {slug}
                          </span>
                        ))}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

import { cache } from "@/hooks/useCache"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import { AppError } from "@/lib/errors"
import { DeleteUserButton } from "./-components/DeleteUserButton"

export default function UsersPage() {
  const currentUser = cache.useCurrentUser()
  const users = cache.useUsers()
  const spaces = cache.useSpaces()
  const navigate = useNavigate()

  if (currentUser.username !== "admin") {
    throw new AppError("forbidden", "This page is only accessible to administrators")
  }

  const getUserSpaces = (userId: string) => spaces.filter((space) => space.members.includes(userId)).map((space) => space.slug)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button onClick={() => navigate("/users/new")}>New User</Button>
      </div>

      {users.length === 0 ? (
        <p className="text-muted-foreground">No users found</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Spaces</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const userSpaces = getUserSpaces(user.id)
              const canDelete = userSpaces.length === 0 && user.id !== currentUser.id

              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
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
                  <TableCell>
                    <DeleteUserButton username={user.username} disabled={!canDelete} />
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

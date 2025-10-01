import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { api } from "@/lib/api"
import { cache } from "@/hooks/useCache"
import { ChevronDownIcon } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { ChangePasswordDialog } from "./ChangePasswordDialog"

export default function Header() {
  const currentUser = cache.useCurrentUser()
  const logoutMutation = api.mutations.useLogout()
  const navigate = useNavigate()
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        void navigate("/login")
      },
    })
  }

  const handleChangePassword = () => {
    setPasswordDialogOpen(true)
  }

  return (
    <header className="py-4 border-b flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold hover:no-underline">
        SpaceNote
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center space-x-2 font-medium border-0 bg-transparent shadow-none focus:outline-none">
          👤{currentUser.username}
          <ChevronDownIcon className="w-4 h-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => void navigate("/spaces/new")}>Create Space</DropdownMenuItem>
          {currentUser.username === "admin" && <DropdownMenuItem onClick={() => void navigate("/users")}>Users</DropdownMenuItem>}
          <DropdownMenuItem onClick={handleChangePassword}>Change Password</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangePasswordDialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen} />
    </header>
  )
}

import { useState } from "react"
import { getFrontendVersion } from "@/lib/version"
import VersionDialog from "./VersionDialog"

export default function Footer() {
  const [showVersionDialog, setShowVersionDialog] = useState(false)
  const frontendVersion = getFrontendVersion()

  return (
    <>
      <footer className="py-4 border-t text-sm text-gray-500 flex justify-between items-center">
        <p>© 2025 SpaceNote</p>
        <button
          type="button"
          onClick={() => {
            setShowVersionDialog(true)
          }}
          className="hover:text-gray-700 transition-colors"
        >
          v{frontendVersion.version}
        </button>
      </footer>
      <VersionDialog open={showVersionDialog} onOpenChange={setShowVersionDialog} />
    </>
  )
}

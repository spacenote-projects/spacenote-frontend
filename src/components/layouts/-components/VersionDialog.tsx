import { useQuery } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { api } from "@/lib/api"
import { getFrontendVersion } from "@/lib/version"

export default function VersionDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { data: backendVersion } = useQuery({
    ...api.queries.version(),
    enabled: open,
  })

  const frontendVersion = getFrontendVersion()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Version Information</DialogTitle>
          <DialogDescription>Frontend and backend build information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-2">Frontend</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Version</td>
                  <td className="py-2 font-mono">{frontendVersion.version}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Git Commit</td>
                  <td className="py-2 font-mono text-xs">{frontendVersion.gitCommitHash}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Commit Date</td>
                  <td className="py-2 font-mono text-xs">{frontendVersion.gitCommitDate}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-600">Build Time</td>
                  <td className="py-2 font-mono text-xs">{frontendVersion.buildTime}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Backend</h3>
            {backendVersion ? (
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Version</td>
                    <td className="py-2 font-mono">{backendVersion.version ?? "N/A"}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Git Commit</td>
                    <td className="py-2 font-mono text-xs">{backendVersion.git_commit_hash ?? "N/A"}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Commit Date</td>
                    <td className="py-2 font-mono text-xs">{backendVersion.git_commit_date ?? "N/A"}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-600">Build Time</td>
                    <td className="py-2 font-mono text-xs">{backendVersion.build_time ?? "N/A"}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-gray-500">Loading...</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

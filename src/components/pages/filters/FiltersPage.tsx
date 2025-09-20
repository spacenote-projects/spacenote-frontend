import { Link, useParams } from "react-router"
import { cache } from "@/hooks/useCache"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { ErrorMessage } from "@/components/shared/ErrorMessage"

export default function FiltersPage() {
  const { slug } = useParams() as { slug: string }
  const space = cache.useSpace(slug)
  const mutation = api.mutations.useRemoveFilter()

  const handleRemove = (filterName: string) => {
    if (!window.confirm(`Remove filter "${filterName}" from this space?`)) return

    mutation.mutate(
      { slug, filterName },
      {
        onSuccess: () => {
          toast.success("Filter removed successfully")
        },
      }
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SpacePageHeader
        space={space}
        section="Filters"
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link to={`/s/${slug}/filters/new`}>New Filter</Link>
          </Button>
        }
      />

      {mutation.error && (
        <div className="mb-4">
          <ErrorMessage error={mutation.error} />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Conditions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {space.filters.map((filter) => (
            <TableRow key={filter.name}>
              <TableCell className="font-medium">{filter.name}</TableCell>
              <TableCell>{filter.title}</TableCell>
              <TableCell>{filter.description || "-"}</TableCell>
              <TableCell>{filter.conditions?.length ?? 0}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    handleRemove(filter.name)
                  }}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Removing..." : "Remove"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {space.filters.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No filters defined yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

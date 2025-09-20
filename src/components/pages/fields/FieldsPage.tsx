import { Link, useParams } from "react-router"
import { cache } from "@/hooks/useCache"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SpacePageHeader } from "@/components/shared/SpacePageHeader"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { ErrorMessage } from "@/components/shared/ErrorMessage"
import DefaultValue from "./-components/DefaultValue"

export default function FieldsPage() {
  const { slug } = useParams() as { slug: string }
  const space = cache.useSpace(slug)
  const mutation = api.mutations.useRemoveSpaceField()

  const handleRemove = (fieldName: string) => {
    if (!window.confirm(`Remove field "${fieldName}" from this space?`)) return

    mutation.mutate(
      { slug, fieldName },
      {
        onSuccess: () => {
          toast.success("Field removed successfully")
        },
      }
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SpacePageHeader
        space={space}
        section="Fields"
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link to={`/s/${slug}/fields/new`}>New Field</Link>
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
            <TableHead>Type</TableHead>
            <TableHead>Required</TableHead>
            <TableHead>Hidden in Create</TableHead>
            <TableHead>Default</TableHead>
            <TableHead>Options</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {space.fields.map((field) => (
            <TableRow key={field.name}>
              <TableCell className="font-medium">{field.name}</TableCell>
              <TableCell>{field.type}</TableCell>
              <TableCell>{field.required ? "Yes" : "No"}</TableCell>
              <TableCell>{space.hidden_create_fields.includes(field.name) ? "Yes" : "No"}</TableCell>
              <TableCell>
                <DefaultValue field={field} />
              </TableCell>
              <TableCell>{field.options ? <code className="text-xs">{JSON.stringify(field.options)}</code> : "-"}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    handleRemove(field.name)
                  }}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Removing..." : "Remove"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {space.fields.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No fields defined yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

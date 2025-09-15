import { Link, useParams } from "react-router"
import { useSpace } from "@/hooks/useCache"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function FieldsPage() {
  const { slug } = useParams() as { slug: string }
  const space = useSpace(slug)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fields - {space.title}</h1>
        <Button asChild>
          <Link to={`/s/${slug}/fields/new`}>Create New Field</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Required</TableHead>
            <TableHead>Default</TableHead>
            <TableHead>Options</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {space.fields.map((field) => (
            <TableRow key={field.name}>
              <TableCell className="font-medium">{field.name}</TableCell>
              <TableCell>{field.type}</TableCell>
              <TableCell>{field.required ? "Yes" : "No"}</TableCell>
              <TableCell>{field.default ?? "-"}</TableCell>
              <TableCell>{field.options ? <code className="text-xs">{JSON.stringify(field.options)}</code> : "-"}</TableCell>
            </TableRow>
          ))}
          {space.fields.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No fields defined yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

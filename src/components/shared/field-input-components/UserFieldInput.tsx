import type { Control } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cache } from "@/hooks/useCache"
import type { SpaceField, Space } from "@/types"

interface UserFieldInputProps {
  field: SpaceField
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
  space: Space
  onChange?: (fieldName: string) => void
}

export default function UserFieldInput({ field, control, name, space, onChange }: UserFieldInputProps) {
  const users = cache.useUsers()
  const members = users.filter((user) => space.members.includes(user.id))

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel>
            {field.id}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <Select
            onValueChange={(value) => {
              formField.onChange(value)
              onChange?.(name)
            }}
            value={formField.value as string}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select member`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {members.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

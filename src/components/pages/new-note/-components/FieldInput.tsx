import type { Control } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { SpaceField } from "@/types"

interface FieldInputProps {
  field: SpaceField
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
}

export default function FieldInput({ field, control, name }: FieldInputProps) {
  switch (field.type) {
    case "string":
      return (
        <FormField
          control={control}
          name={name}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>
                {field.name}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
              <FormControl>
                <Input {...formField} value={formField.value as string} placeholder={`Enter ${field.name}`} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )

    case "markdown":
      return (
        <FormField
          control={control}
          name={name}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>
                {field.name}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...formField}
                  value={formField.value as string}
                  placeholder={`Enter ${field.name} (Markdown supported)`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )

    case "boolean": {
      return (
        <FormField
          control={control}
          name={name}
          render={({ field: formField }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={formField.value as boolean} onCheckedChange={formField.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  {field.name}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )
    }

    case "string_choice": {
      const options = field.options?.values as string[] | undefined
      return (
        <FormField
          control={control}
          name={name}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>
                {field.name}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
              <Select onValueChange={formField.onChange} value={formField.value as string}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${field.name}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
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

    case "tags":
      return (
        <FormField
          control={control}
          name={name}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>
                {field.name}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
              <FormControl>
                <Input {...formField} value={formField.value as string} placeholder={`Enter ${field.name} (comma-separated)`} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )

    case "user":
      return (
        <FormField
          control={control}
          name={name}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>
                {field.name}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
              <FormControl>
                <Input {...formField} value={formField.value as string} placeholder={`Enter username`} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )

    case "int":
    case "float":
      return (
        <FormField
          control={control}
          name={name}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>
                {field.name}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
              <FormControl>
                <Input
                  {...formField}
                  value={formField.value as string}
                  type="number"
                  step={field.type === "float" ? "0.01" : "1"}
                  placeholder={`Enter ${field.name}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )

    case "datetime":
      return (
        <FormField
          control={control}
          name={name}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>
                {field.name}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
              <FormControl>
                <Input {...formField} value={formField.value as string} type="datetime-local" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )

    default:
      return (
        <FormField
          control={control}
          name={name}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>
                {field.name}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
              <FormControl>
                <Input {...formField} value={formField.value as string} placeholder={`Enter ${field.name}`} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )
  }
}

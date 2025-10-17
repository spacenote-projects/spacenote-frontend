import type { Control } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import MarkdownEditor from "@/components/shared/MarkdownEditor"
import UserFieldInput from "@/components/shared/field-input-components/UserFieldInput"
import ImageFieldInput from "@/components/shared/field-input-components/ImageFieldInput"
import type { SpaceField, Space } from "@/types"

interface FieldInputProps {
  /** The field configuration from the space schema */
  field: SpaceField
  /** React Hook Form control object for managing form state */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  /** The form field name to bind to */
  name: string
  /** The space containing this field (used for member lookups in user fields) */
  space: Space
  /** Optional callback fired when field value changes (used for tracking dirty fields) */
  onChange?: (fieldName: string) => void
}

/**
 * FieldInput Component
 *
 * A dynamic form field component that renders the appropriate input type
 * based on the field's type configuration. Supports all SpaceNote field types
 * including string, markdown, boolean, select, tags, user, number, and datetime.
 *
 * This component integrates with React Hook Form for form state management
 * and validation, and is used in both note creation and editing forms.
 *
 * @example
 * ```tsx
 * <FieldInput
 *   field={titleField}
 *   control={form.control}
 *   name="title"
 *   space={currentSpace}
 *   onChange={(fieldName) => console.log(`${fieldName} changed`)}
 * />
 * ```
 */
export default function FieldInput({ field, control, name, space, onChange }: FieldInputProps) {
  switch (field.type) {
    case "string":
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
              <FormControl>
                <Input
                  {...formField}
                  value={formField.value as string}
                  placeholder={`Enter ${field.id}`}
                  onChange={(e) => {
                    formField.onChange(e)
                    onChange?.(name)
                  }}
                />
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
                {field.id}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
              <FormControl>
                <MarkdownEditor
                  value={formField.value as string}
                  onChange={(value) => {
                    formField.onChange(value)
                    onChange?.(name)
                  }}
                  placeholder={`Enter ${field.id} (Markdown supported)`}
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
                <Checkbox
                  checked={formField.value as boolean}
                  onCheckedChange={(checked) => {
                    formField.onChange(checked)
                    onChange?.(name)
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  {field.id}
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
                    <SelectValue placeholder={`Select ${field.id}`} />
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
                {field.id}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
              <FormControl>
                <Input
                  {...formField}
                  value={formField.value as string}
                  placeholder={`Enter ${field.id} (comma-separated)`}
                  onChange={(e) => {
                    formField.onChange(e)
                    onChange?.(name)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )

    case "user":
      return <UserFieldInput field={field} control={control} name={name} space={space} onChange={onChange} />

    case "int":
    case "float":
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
              <FormControl>
                <Input
                  {...formField}
                  value={formField.value as string}
                  type="number"
                  step={field.type === "float" ? "0.01" : "1"}
                  placeholder={`Enter ${field.id}`}
                  onChange={(e) => {
                    formField.onChange(e)
                    onChange?.(name)
                  }}
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
                {field.id}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
              <FormControl>
                <Input
                  {...formField}
                  value={formField.value as string}
                  type="datetime-local"
                  onChange={(e) => {
                    formField.onChange(e)
                    onChange?.(name)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )

    case "image":
      return <ImageFieldInput field={field} control={control} name={name} space={space} onChange={onChange} />

    default:
      // Fallback for any unknown field types - renders a basic text input
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
              <FormControl>
                <Input
                  {...formField}
                  value={formField.value as string}
                  placeholder={`Enter ${field.id}`}
                  onChange={(e) => {
                    formField.onChange(e)
                    onChange?.(name)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )
  }
}

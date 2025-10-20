import type { Control, ControllerRenderProps } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { SpaceField } from "@/types"
import { getUserTimezoneOffset } from "@/lib/datetime"

interface DatetimeFieldInputProps {
  field: SpaceField
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
  onChange?: (fieldName: string) => void
}

interface DatetimeFieldContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formField: ControllerRenderProps<any>
  field: SpaceField
  name: string
  onChange?: (fieldName: string) => void
}

function DatetimeFieldContent({ formField, field, name, onChange }: DatetimeFieldContentProps) {
  const useNow = formField.value === "$now"

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      formField.onChange("$now")
    } else {
      formField.onChange("")
    }
    onChange?.(name)
  }

  const handleDatetimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formField.onChange(e)
    onChange?.(name)
  }

  const userTimezone = getUserTimezoneOffset()

  return (
    <FormItem>
      <FormLabel>
        {field.id}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </FormLabel>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id={`${name}-use-now`} checked={useNow} onCheckedChange={handleCheckboxChange} />
          <label
            htmlFor={`${name}-use-now`}
            className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Use current time ($now)
          </label>
        </div>

        {useNow ? (
          <div className="text-sm text-muted-foreground">Will be set to current time on submission</div>
        ) : (
          <div className="space-y-2">
            <FormControl>
              <Input
                {...formField}
                value={formField.value === "$now" ? "" : (formField.value as string)}
                type="datetime-local"
                onChange={handleDatetimeChange}
              />
            </FormControl>
            <div className="text-xs text-muted-foreground">Your timezone: {userTimezone}</div>
          </div>
        )}
      </div>

      <FormMessage />
    </FormItem>
  )
}

export default function DatetimeFieldInput({ field, control, name, onChange }: DatetimeFieldInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: formField }) => (
        <DatetimeFieldContent formField={formField} field={field} name={name} onChange={onChange} />
      )}
    />
  )
}

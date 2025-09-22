import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cache } from "@/hooks/useCache"
import type { FilterCondition, FilterOperator, SpaceField } from "@/types"
import { Plus, X } from "lucide-react"

interface FilterConditionsEditorProps {
  conditions: FilterCondition[]
  onChange: (conditions: FilterCondition[]) => void
  fields: SpaceField[]
}

export function FilterConditionsEditor({ conditions, onChange, fields }: FilterConditionsEditorProps) {
  const fieldOperators = cache.useFieldOperators()

  const addCondition = () => {
    onChange([...conditions, { field: "", operator: "eq", value: null }])
  }

  const removeCondition = (index: number) => {
    onChange(conditions.filter((_, i) => i !== index))
  }

  const updateCondition = (index: number, updates: Partial<FilterCondition>) => {
    const newConditions = [...conditions]
    newConditions[index] = { ...newConditions[index], ...updates }

    // If field changed, check if current operator is still valid
    if (updates.field) {
      const condition = newConditions[index]
      const field = fields.find((f) => f.id === condition.field)
      if (field) {
        const validOperators = fieldOperators[field.type]
        if (!validOperators.includes(condition.operator)) {
          // Reset to first valid operator if current is invalid
          newConditions[index].operator = validOperators[0] ?? "eq"
        }
      }
    }

    onChange(newConditions)
  }

  const parseValue = (value: string, operator: FilterOperator, shouldParse = true) => {
    if (!value.trim()) return null

    if ((operator === "in" || operator === "nin" || operator === "all") && shouldParse) {
      return value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    }

    const numValue = Number(value)
    if (!isNaN(numValue) && (operator === "gt" || operator === "gte" || operator === "lt" || operator === "lte")) {
      return numValue
    }

    return value
  }

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) {
      return ""
    }
    if (Array.isArray(value)) {
      return value.join(", ")
    }
    if (typeof value === "object") {
      return JSON.stringify(value)
    }
    if (typeof value === "string") {
      return value
    }
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value)
    }
    return ""
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Filter Conditions</label>
        <Button type="button" variant="outline" size="sm" onClick={addCondition}>
          <Plus className="h-4 w-4 mr-1" />
          Add Condition
        </Button>
      </div>

      {conditions.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded">
          No conditions added. All notes will match this filter.
        </div>
      )}

      {conditions.map((condition, index) => {
        const conditionKey = `condition-${String(index)}`
        const selectedField = fields.find((f) => f.id === condition.field)
        const availableOperators = selectedField ? fieldOperators[selectedField.type] : []

        return (
          <div key={conditionKey} className="flex gap-2 items-start">
            <Select
              value={condition.field}
              onValueChange={(field) => {
                updateCondition(index, { field })
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {fields.map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={condition.operator}
              onValueChange={(operator) => {
                updateCondition(index, { operator: operator as FilterOperator })
              }}
              disabled={!selectedField}
            >
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableOperators.map((op) => (
                  <SelectItem key={op} value={op}>
                    {op}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              className="flex-1"
              placeholder={
                condition.operator === "in" || condition.operator === "nin" || condition.operator === "all"
                  ? "value1, value2"
                  : "Value"
              }
              value={
                condition.operator === "in" || condition.operator === "nin" || condition.operator === "all"
                  ? typeof condition.value === "string"
                    ? condition.value
                    : formatValue(condition.value)
                  : formatValue(condition.value)
              }
              onChange={(e) => {
                const isArrayOperator =
                  condition.operator === "in" || condition.operator === "nin" || condition.operator === "all"
                updateCondition(index, {
                  value: isArrayOperator ? e.target.value : parseValue(e.target.value, condition.operator),
                })
              }}
              onBlur={(e) => {
                const isArrayOperator =
                  condition.operator === "in" || condition.operator === "nin" || condition.operator === "all"
                if (isArrayOperator) {
                  updateCondition(index, { value: parseValue(e.target.value, condition.operator, true) })
                }
              }}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                removeCondition(index)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )
      })}

      {conditions.length > 0 && (
        <p className="text-sm text-muted-foreground">All conditions must be true for a note to match (AND logic)</p>
      )}
    </div>
  )
}

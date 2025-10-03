import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface QueryCondition {
  field: string
  operator: string
  value: string
  rawCondition: string
}

function parseQueryCondition(condition: string): QueryCondition | null {
  const parts = condition.split(":")
  if (parts.length < 3) return null

  const field = parts[0]
  const operator = parts[1]
  const value = parts.slice(2).join(":")

  return {
    field,
    operator,
    value,
    rawCondition: condition,
  }
}

function formatConditionDisplay(condition: QueryCondition): string {
  const { field, operator, value } = condition

  const decodedValue = decodeURIComponent(value)

  if (operator === "in" || operator === "nin") {
    try {
      const arrayValue = JSON.parse(decodedValue) as string[]
      const values = arrayValue.join(", ")
      return `${field} ${operator === "in" ? "in" : "not in"} ${values}`
    } catch {
      return `${field} ${operator} ${decodedValue}`
    }
  }

  const operatorMap: Record<string, string> = {
    eq: "=",
    ne: "≠",
    gt: ">",
    gte: "≥",
    lt: "<",
    lte: "≤",
    contains: "contains",
  }

  const displayOperator = operatorMap[operator] || operator

  return `${field} ${displayOperator} ${decodedValue}`
}

function removeCondition(query: string, conditionToRemove: string): string | null {
  const conditions = query.split(",").filter((c) => c !== conditionToRemove)
  return conditions.length > 0 ? conditions.join(",") : null
}

export function ActiveQueryFilters({
  q,
  onQueryChange,
}: {
  q: string | undefined
  onQueryChange: (newQ: string | null) => void
}) {
  if (!q) return null

  const conditions = q
    .split(",")
    .map(parseQueryCondition)
    .filter((c): c is QueryCondition => c !== null)

  if (conditions.length === 0) return null

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {conditions.map((condition) => (
        <Badge key={condition.rawCondition} variant="outline" className="gap-1.5">
          <span>{formatConditionDisplay(condition)}</span>
          <button
            type="button"
            onClick={() => {
              const newQuery = removeCondition(q, condition.rawCondition)
              onQueryChange(newQuery)
            }}
            className="hover:text-destructive transition-colors"
            aria-label={`Remove filter: ${formatConditionDisplay(condition)}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  )
}

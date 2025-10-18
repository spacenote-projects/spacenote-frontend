import { cache } from "@/hooks/useCache"
import type { SpaceField } from "@/types"

function UserDefaultValue({ userId }: { userId: string }) {
  if (userId === "$me") {
    return <>$me</>
  }

  try {
    const user = cache.useUser(userId)
    return <>{user.username}</>
  } catch {
    return <>Unknown</>
  }
}

export default function DefaultValue({ field }: { field: SpaceField }) {
  const { default: defaultValue, type } = field

  if (defaultValue === undefined || defaultValue === null) {
    return <>-</>
  }

  switch (type) {
    case "user":
      if (typeof defaultValue === "string") {
        return <UserDefaultValue userId={defaultValue} />
      }
      return <>{String(defaultValue)}</>

    case "boolean":
      return <>{String(defaultValue)}</>

    case "tags":
    case "select":
      if (Array.isArray(defaultValue)) {
        return <>{defaultValue.join(", ")}</>
      }
      return <>{String(defaultValue)}</>

    case "datetime":
      if (typeof defaultValue === "string") {
        return <>{defaultValue}</>
      }
      return <>{String(defaultValue)}</>

    case "int":
    case "float":
    case "string":
    case "markdown":
    default:
      return <>{String(defaultValue)}</>
  }
}

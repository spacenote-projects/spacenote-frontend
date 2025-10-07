const NOTES_PARAMS_PREFIX = "spacenote_notes_params_"

export function saveNotesListParams(slug: string, searchParams: URLSearchParams): void {
  const key = `${NOTES_PARAMS_PREFIX}${slug}`
  const paramsString = searchParams.toString()

  if (paramsString) {
    sessionStorage.setItem(key, paramsString)
  } else {
    sessionStorage.removeItem(key)
  }
}

export function getNotesListParams(slug: string): string {
  const key = `${NOTES_PARAMS_PREFIX}${slug}`
  return sessionStorage.getItem(key) ?? ""
}

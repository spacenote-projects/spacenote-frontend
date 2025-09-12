const AUTH_TOKEN_KEY = "authToken"

function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

function setAuthToken(authToken: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, authToken)
}

function clearAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export const authStorage = {
  getAuthToken,
  setAuthToken,
  clearAuthToken,
}

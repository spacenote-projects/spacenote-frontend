import ky from "ky"
import { AppError } from "@/lib/errors"
import { authStorage } from "@/lib/auth-storage"

const resolveApiUrl = (): string => {
  // Development: use VITE_API_URL from .env
  if (import.meta.env.DEV) {
    const envUrl = import.meta.env.VITE_API_URL
    if (!envUrl) {
      throw new Error("VITE_API_URL is not defined in .env file")
    }
    return envUrl
  }

  // Production: use runtime config from window.__SPACENOTE_CONFIG__
  if (typeof window === "undefined") {
    throw new Error("Cannot resolve API URL: window is undefined")
  }

  const config = window.__SPACENOTE_CONFIG__
  if (!config?.API_URL) {
    throw new Error("API_URL is not configured. Please check runtime-config.js")
  }

  return config.API_URL
}

const apiUrl = resolveApiUrl()

export const httpClient = ky.create({
  prefixUrl: apiUrl,
  hooks: {
    beforeRequest: [
      (request) => {
        const authToken = authStorage.getAuthToken()
        if (authToken) {
          request.headers.set("Authorization", `Bearer ${authToken}`)
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        // Handle 401 redirect early
        if (response.status === 401) {
          const isLoginPage = window.location.pathname === "/login"
          if (!isLoginPage) {
            authStorage.clearAuthToken()
            window.location.href = "/login"
          }
        }

        if (!response.ok) {
          // Shape non-OK responses into AppError with best-effort message extraction
          const code = AppError.codeFromStatus(response.status)
          let message = `HTTP ${String(response.status)} ${response.statusText}`
          try {
            const contentType = response.headers.get("content-type")
            if (contentType?.includes("application/json")) {
              const data = (await response.clone().json()) as Record<string, unknown>
              if (typeof data.message === "string" && data.message.trim() !== "") {
                message = data.message
              }
            }
          } catch {
            // Ignore parsing errors and use fallback message
          }
          throw new AppError(code, message)
        }

        return response
      },
    ],
  },
})

import ky from "ky"
import { AppError } from "@/lib/errors"
import { authStorage } from "@/lib/auth-storage"

const apiUrl = import.meta.env.VITE_API_URL || ""

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

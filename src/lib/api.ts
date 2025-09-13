import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import ky from "ky"
import { AppError } from "@/lib/errors"
import { authStorage } from "@/lib/auth-storage"
import type { LoginRequest, LoginResponse, User } from "@/types"

const apiUrl = import.meta.env.VITE_API_URL || ""

const httpClient = ky.create({
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

export const api = {
  queries: {
    currentUser: () =>
      queryOptions({
        queryKey: ["currentUser"],
        queryFn: () => httpClient.get("api/v1/profile").json<User>(),
        staleTime: Infinity,
        gcTime: Infinity,
      }),
  },
  mutations: {
    useLogin: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: (credentials: LoginRequest) =>
          httpClient.post("api/v1/auth/login", { json: credentials }).json<LoginResponse>(),
        onSuccess: async (response) => {
          authStorage.setAuthToken(response.token)
          // Fetch the current user after successful login
          await queryClient.invalidateQueries({ queryKey: ["currentUser"] })
        },
      })
    },

    useLogout: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: () => httpClient.post("api/v1/auth/logout"),
        onSuccess: () => {
          authStorage.clearAuthToken()
          queryClient.setQueryData(["currentUser"], null)
          queryClient.clear()
        },
      })
    },

    useChangePassword: () => {
      return useMutation({
        mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
          httpClient.post("api/v1/profile/change-password", { json: { currentPassword, newPassword } }),
      })
    },
  },
}

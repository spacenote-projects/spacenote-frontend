import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./index.css"
import { RouterProvider } from "react-router"
import { createRouter } from "@/router"
import { api } from "@/lib/api"
import { authStorage } from "@/lib/auth-storage"
import { toast } from "sonner"
import { AppError } from "@/lib/errors"
import { Toaster } from "@/components/ui/sonner"
import { z } from "zod"
import { en } from "zod/locales"

// Configure Zod to use English error messages in production
z.config(en())

async function startApp() {
  const router = createRouter()
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Only show error toasts for background refetches when there's existing data
        // This prevents duplicate error notifications on initial load
        if (query.state.data !== undefined) {
          const appError = AppError.fromUnknown(error)
          toast.error(appError.message)
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        // Log all mutation errors for monitoring
        const appError = AppError.fromUnknown(error)
        console.error("Mutation error:", appError)
      },
    }),
  })

  // Initialize auth from localStorage
  const authToken = authStorage.getAuthToken()
  if (authToken) {
    // Prefetch critical data only if authenticated
    // This ensures users, forums, and current user are loaded once at app start
    try {
      await Promise.all([
        queryClient.prefetchQuery(api.queries.currentUser()),
        queryClient.prefetchQuery(api.queries.spaces()),
        queryClient.prefetchQuery(api.queries.users()),
      ])
    } catch (error) {
      // If prefetch fails (likely 401), the afterResponse hook will handle redirect
      console.error("Failed to prefetch data:", error)
    }
  }

  // Render the app after MSW is ready
  const rootElement = document.getElementById("root")
  if (!rootElement) throw new Error("Root element not found")

  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </StrictMode>
  )
}

void startApp()

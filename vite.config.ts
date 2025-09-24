import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "path"

// Injects runtime-config.js script tag only in production builds.
// Development uses VITE_API_URL from .env, while production Docker
// deployments generate runtime-config.js via entrypoint.sh to set API_URL.
// This prevents 404 errors in development where runtime-config.js doesn't exist.
function runtimeConfigPlugin(): Plugin {
  return {
    name: "runtime-config",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        // Only inject in production builds (ctx.bundle exists and not dev server)
        if (ctx.bundle && !ctx.server) {
          const scriptTag = '    <script src="/runtime-config.js"></script>\n'
          return html.replace("</head>", `${scriptTag}</head>`)
        }
        return html
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), runtimeConfigPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3100",
        changeOrigin: true,
      },
    },
  },
})

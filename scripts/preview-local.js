#!/usr/bin/env node
import { writeFileSync, existsSync } from "node:fs"
import { execSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, "..")
const distPath = join(projectRoot, "dist")

// Get API URL from environment or use default
const apiUrl = process.env.VITE_API_URL || "http://localhost:3100"

console.log("Building for production...")
execSync("pnpm run build", { stdio: "inherit", cwd: projectRoot })

// Check if dist folder exists
if (!existsSync(distPath)) {
  console.error("Error: dist folder not found after build")
  process.exit(1)
}

// Create runtime config
const config = `window.__SPACENOTE_CONFIG__ = {
  API_URL: ${JSON.stringify(apiUrl)}
};
`

const configPath = join(distPath, "runtime-config.js")
writeFileSync(configPath, config, "utf8")
console.log(`Runtime config created with API_URL: ${apiUrl}`)

// Start preview server
console.log("Starting preview server...")
execSync("vite preview", { stdio: "inherit", cwd: projectRoot })

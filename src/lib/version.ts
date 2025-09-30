import packageJson from "../../package.json"

export interface FrontendVersionInfo {
  version: string
  gitCommitHash: string
  gitCommitDate: string
  buildTime: string
}

export function getFrontendVersion(): FrontendVersionInfo {
  return {
    version: packageJson.version,
    gitCommitHash: (import.meta.env.VITE_GIT_COMMIT_HASH as string | undefined) ?? "development",
    gitCommitDate: (import.meta.env.VITE_GIT_COMMIT_DATE as string | undefined) ?? "N/A",
    buildTime: (import.meta.env.VITE_BUILD_TIME as string | undefined) ?? "N/A",
  }
}

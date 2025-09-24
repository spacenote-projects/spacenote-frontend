/// <reference types="vite/client" />
/* eslint-disable @typescript-eslint/no-unused-vars */

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface SpacenoteRuntimeConfig {
  API_URL?: string
}

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  interface Window {
    __SPACENOTE_CONFIG__?: SpacenoteRuntimeConfig
  }
}

export {}

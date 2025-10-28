/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_NETWORK: string
  readonly VITE_LINERA_SERVICE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

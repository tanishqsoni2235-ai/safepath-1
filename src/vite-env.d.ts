/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TOMORROW_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
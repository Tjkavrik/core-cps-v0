/**
 * Central runtime configuration, read from environment variables.
 * Nothing here is Abacus-specific; every value is portable (see ADR-005).
 * Unverified business values are NOT hard-coded — they are configuration.
 */
export const config = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "CPS V0.1 (Prototype)",
  appEnv: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
  fileUploadMaxMb: Number(process.env.FILE_UPLOAD_MAX_MB ?? "25"),
  fileUploadDir: process.env.FILE_UPLOAD_DIR ?? "./uploads",
  fileUploadProvider: process.env.FILE_UPLOAD_PROVIDER ?? "local",
  logLevel: process.env.LOG_LEVEL ?? "info",
} as const;

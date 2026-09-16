import { NextResponse } from "next/server";

/**
 * Liveness endpoint. Deliberately does NOT touch Abacus-specific services.
 * Useful for container orchestration / uptime checks in any environment.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: process.env.NEXT_PUBLIC_APP_NAME ?? "CPS V0.1 (Prototype)",
    env: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
    time: new Date().toISOString(),
  });
}

"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { DemoBanner } from "@/components/ui/DemoBanner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardBody } from "@/components/ui/Card";

const DEMO_ACCOUNTS = [
  { email: "project.user@demo.cps", name: "Alex Rivera", role: "Project User" },
  { email: "coordinator@demo.cps", name: "Jordan Hayes", role: "CPS Coordinator" },
  { email: "warehouse@demo.cps", name: "Sam Chen", role: "CPS Warehouse / Logistics" },
  { email: "manager@demo.cps", name: "Morgan Davis", role: "CPS Manager" },
  { email: "viewer@demo.cps", name: "Casey Kim", role: "Read-Only Viewer" },
  { email: "admin@demo.cps", name: "Taylor Brooks", role: "System Admin" },
];
const DEMO_PASSWORD = "demo1234";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(params.get("callbackUrl") || "/");
    router.refresh();
  }

  function fill(demoEmail: string) {
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
    setError(null);
  }

  return (
    <div className="flex min-h-screen flex-col bg-cps-gray100">
      <DemoBanner />
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-cps-navy">CORE Construction Project Services</h1>
            <p className="mt-1 text-sm text-cps-slate">Equipment & Project Services — V0.1 Prototype</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Login form */}
            <Card>
              <CardBody>
                <h2 className="mb-4 text-lg font-semibold text-cps-navy">Sign in</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email" required>
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" required>
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in…" : "Sign in"}
                  </Button>
                </form>
                <div className="mt-4 rounded-md border border-cps-orange/30 bg-cps-orange/10 px-3 py-2 text-xs text-cps-orange">
                  This is a prototype. Do not enter real CORE credentials.
                </div>
              </CardBody>
            </Card>

            {/* Demo accounts */}
            <Card>
              <CardBody>
                <h2 className="mb-1 text-lg font-semibold text-cps-navy">Demo accounts</h2>
                <p className="mb-3 text-xs text-cps-slate">
                  Click any account to fill the form. Password for all demo accounts:{" "}
                  <code className="rounded bg-cps-gray100 px-1">{DEMO_PASSWORD}</code>
                </p>
                <ul className="space-y-2">
                  {DEMO_ACCOUNTS.map((a) => (
                    <li key={a.email}>
                      <button
                        type="button"
                        onClick={() => fill(a.email)}
                        className="flex w-full items-center justify-between rounded-md border border-cps-gray200 bg-white px-3 py-2 text-left text-sm hover:border-cps-blue hover:bg-cps-gray100"
                      >
                        <span>
                          <span className="block font-medium text-cps-navy">{a.name}</span>
                          <span className="block text-xs text-cps-slate">{a.email}</span>
                        </span>
                        <span className="ml-2 shrink-0 rounded bg-cps-gray100 px-2 py-0.5 text-[11px] font-medium text-cps-slate">
                          {a.role}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

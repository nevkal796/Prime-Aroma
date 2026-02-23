"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#EDE8D0] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl font-medium text-[#0a1628]">
          Admin
        </h1>
        <p className="mt-1 font-sans text-xs uppercase tracking-widest text-[#0a1628]/70">
          Sign in to manage products
        </p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <label className="font-sans text-xs uppercase tracking-widest text-[#0a1628]/80">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-[44px] border border-[#0a1628]/30 bg-transparent px-4 font-sans text-[#0a1628] placeholder:text-[#0a1628]/50"
            placeholder="Enter admin password"
            required
            autoFocus
          />
          {error && (
            <p className="font-sans text-sm text-red-700">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="min-h-[44px] w-full bg-[#0a1628] font-sans text-xs font-medium uppercase tracking-widest text-[#EDE8D0] disabled:opacity-70"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}

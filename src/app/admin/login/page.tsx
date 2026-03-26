"use client";

import { useState } from "react";
import { adminLogin } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = await adminLogin(password);
    if (ok) {
      router.push("/admin/theme");
    } else {
      setError("Senha incorreta. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-full max-w-sm p-8 border border-zinc-800 rounded-lg">
        <h1 className="text-xl font-bold text-zinc-100 mb-2 font-mono tracking-tight">
          Admin Panel
        </h1>
        <p className="text-sm text-zinc-500 mb-8">
          Digite a senha para acessar o painel.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
            autoFocus
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-zinc-100 text-zinc-900 rounded text-sm font-bold hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

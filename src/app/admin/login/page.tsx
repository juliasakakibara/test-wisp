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
    <div className="admin-login">
      <div className="admin-panel">
        <h1 className="admin-title">Admin Panel</h1>
        <p className="admin-lead">Digite a senha para acessar o painel.</p>
        <form onSubmit={handleSubmit} className="admin-form">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="admin-input"
            autoFocus
          />
          {error ? <p className="admin-error">{error}</p> : null}
          <button type="submit" disabled={loading} className="admin-button">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

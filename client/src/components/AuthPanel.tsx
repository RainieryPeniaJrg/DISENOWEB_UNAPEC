import { FormEvent, useState } from "react";
import { useAuth } from "../state/AuthContext";
import { Icon } from "./Icon";

export function AuthPanel() {
  const { user, login, register, logout, loading, error } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("julia@demo.local");
  const [password, setPassword] = useState("julia123");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      await login(email, password);
    } else {
      await register(name || "Usuario", email, password);
    }
  };

  if (user) {
    return (
      <div className="panel auth-panel">
        <p className="eyebrow">Sesión</p>
        <h4>{user.name}</h4>
        <p className="muted small">{user.email}</p>
        <button className="btn ghost" onClick={logout}>
          <Icon name="logout" /> Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="panel auth-panel">
      <div className="tabs">
        <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
          Acceder
        </button>
        <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
          Registrarse
        </button>
      </div>

      <form className="stack-sm" onSubmit={handleSubmit}>
        {mode === "register" && (
          <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
        )}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="small error-text">{error}</p>}
        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? "Enviando..." : mode === "login" ? "Acceder" : "Crear cuenta"}
        </button>
      </form>
      <p className="micro muted">Demo: julia@demo.local / julia123</p>
    </div>
  );
}

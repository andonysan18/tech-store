"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Loader2, ShieldCheck } from "lucide-react"; // 👈 Agregamos icono User
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export default function AdminLoginPage() {
  const [username, setUsername] = useState(""); // 👈 Nuevo estado
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // 👈 Enviamos ambos
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error de autenticación");
      }

      router.push("/admin/");
      router.refresh();
      
    } catch (err) {
      setError("Usuario o contraseña incorrectos.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        <div className="bg-slate-900 p-8 text-center">
          <div className="mx-auto bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mb-4 ring-4 ring-slate-700">
            <ShieldCheck className="text-blue-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">TechStore Admin</h1>
          <p className="text-slate-400 text-sm">
            Acceso restringido al personal.
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 👇 NUEVO INPUT DE USUARIO */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <User size={16} /> Usuario
              </label>
              <Input
                type="text"
                placeholder="admin"
                className="h-12 text-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Lock size={16} /> Contraseña
              </label>
              <Input
                type="password"
                placeholder="••••••••••••"
                className="h-12 text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium animate-in fade-in">
                ⚠️ {error}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading || !password || !username}
              className="w-full h-12 text-md font-bold bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando...
                </>
              ) : (
                "Ingresar"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock, Mail, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });

      if (result?.error) {
        setError("Credenciales inválidas. Verifica email y contraseña.");
        setIsLoading(false);
      } else if (result?.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Error de conexión con el servidor.");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Ocurrió un error inesperado.");
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
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mail size={16} /> Email Corporativo
              </label>
              <Input
                type="email"
                placeholder="admin@techstore.com"
                className="h-12 text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              disabled={isLoading || !password || !email}
              className="w-full h-12 text-md font-bold bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando...
                </>
              ) : (
                "Ingresar al Panel"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
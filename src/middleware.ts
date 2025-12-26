import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Lógica adicional si quieres loguear cosas
    // console.log("👮‍♂️ Revisando acceso a:", req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;

        // 🔥 LA SOLUCIÓN: Si intenta entrar al login, DÉJALO PASAR
        if (path === "/admin/login") {
          return true;
        }

        // Para cualquier otra ruta /admin, verifica si hay token
        // También verificamos que sea ADMIN (opcional, pero recomendado)
        return !!token && token.role === "ADMIN";
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
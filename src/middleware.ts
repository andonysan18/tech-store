import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 👇 AGREGAMOS ESTO PARA ESPIAR EN LA TERMINAL
  console.log("👮‍♂️ PATOVICA ACTIVO: Alguien intenta entrar a:", request.nextUrl.pathname);

  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith('/admin');
  const isPublicAdminRoute = path === '/admin/login';

  // Verificamos si es ruta admin protegida
  if (isAdminRoute && !isPublicAdminRoute) {
    const cookie = request.cookies.get('admin_session');
    
    console.log("🍪 Cookie encontrada:", cookie); // 👀 Vemos si hay cookie

    if (!cookie) {
      console.log("🚫 ACCESO DENEGADO. Redirigiendo al login...");
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
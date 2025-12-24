"use client"; 

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Zap } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Si estamos en el panel de admin, ocultamos el footer
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="border-t bg-slate-50 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          
          {/* Columna 1: Marca */}
          <div className="space-y-4">
              <Link href="/" className="flex items-center gap-1 group w-fit">
                <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                  <Zap size={20} fill="currentColor" />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Tech<span className="text-blue-600">Store</span>
                </span>
              </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Tu destino número uno para la mejor tecnología. Reparaciones certificadas, calidad garantizada y envíos a todo el país.
            </p>
          </div>

          {/* Columna 2: Tienda */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Tienda</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {/* Rutas corregidas para coincidir con tu estructura de carpetas */}
              <li><Link href="/category/celulares" className="hover:text-blue-600 transition-colors">Celulares</Link></li>
              <li><Link href="/category/consolas" className="hover:text-blue-600 transition-colors">Consolas</Link></li>
              <li><Link href="/offers" className="hover:text-blue-600 transition-colors">Ofertas</Link></li>
              {/* <li><Link href="/tracking" className="hover:text-blue-600 transition-colors">Seguimiento</Link></li> */}
            </ul>
          </div>

          {/* Columna 3: Soporte (Asumiendo que crearás estas páginas luego) */}
          {/* <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Soporte</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/help" className="hover:text-blue-600 transition-colors">Centro de Ayuda</Link></li>
              <li><Link href="/warranty" className="hover:text-blue-600 transition-colors">Garantía</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contacto</Link></li>
            </ul>
          </div> */}

          {/* Columna 4: Newsletter */}
          <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Novedades</h4>
              <p className="text-xs text-gray-500">Suscríbete para recibir ofertas exclusivas.</p>
              <div className="flex gap-2">
                  <Input className="bg-white border-slate-200 focus-visible:ring-blue-600" placeholder="tu@email.com" />
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">OK</Button>
              </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 text-center text-xs text-gray-500 flex flex-col md:flex-row justify-center items-center gap-4">
          <p>© {new Date().getFullYear()} TechStore. Todos los derechos reservados.</p>
          {/* <div className="flex gap-4">
             <Link href="/terms" className="hover:underline">Términos</Link>
             <Link href="/privacy" className="hover:underline">Privacidad</Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
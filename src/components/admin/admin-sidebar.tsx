"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // 👈 Para saber en qué pagina estamos
import { LayoutDashboard, ShoppingBag, Wrench, Package, Users, LogOut, LucideIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/src/lib/utils"; // Si no tienes cn, usa template literals normales

// Configuración de los links
const menuItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Pedidos" },
  { href: "/admin/repairs", icon: Wrench, label: "Reparaciones" },
  { href: "/admin/products", icon: Package, label: "Inventario" },
  { href: "/admin/users", icon: Users, label: "Clientes" },
];

export function AdminSidebar() {
  const pathname = usePathname(); // Obtenemos la URL actual

  return (
    <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-wider">TECH ADMIN</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          // Verificamos si el link está activo (exacto o parcial)
          const isActive = item.href === "/admin" 
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                  : "hover:bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <item.icon size={20} /> 
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-900/30 text-red-400 hover:text-red-300 transition"
        >
          <LogOut size={20} /> Salir
        </button>
      </div>
    </aside>
  );
}
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Wrench, Package, Users, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-wider">TECH ADMIN</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-white">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-white">
            <ShoppingBag size={20} /> Pedidos
          </Link>
          <Link href="/admin/repairs" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-white">
            <Wrench size={20} /> Reparaciones
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-white">
            <Package size={20} /> Inventario
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-white">
            <Users size={20} /> Clientes
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-900/50 text-red-400 transition">
            <LogOut size={20} /> Salir
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
      
    </div>
  );
}
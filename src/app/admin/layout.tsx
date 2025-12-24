import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Zap
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20">
        
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
           <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-1 rounded-md">
                <Zap size={18} fill="currentColor" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Tech<span className="text-blue-500">Admin</span>
              </span>
           </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Principal
          </p>
          
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-600 text-white shadow-md transition-all">
             <LayoutDashboard size={20} />
             <span className="font-medium">Dashboard</span>
          </Link>

          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-all group">
             <Package size={20} className="group-hover:text-blue-400 transition-colors"/>
             <span className="font-medium">Productos</span>
          </Link>
          
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-all group">
             <ShoppingCart size={20} className="group-hover:text-purple-400 transition-colors"/>
             <span className="font-medium">Pedidos</span>
          </Link>

          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-all group">
             <Users size={20} className="group-hover:text-green-400 transition-colors"/>
             <span className="font-medium">Clientes</span>
          </Link>

          <div className="pt-4 mt-4 border-t border-slate-800">
             <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
               Configuración
             </p>
             <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-all">
                <Settings size={20} />
                <span className="font-medium">Ajustes</span>
             </Link>
          </div>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <button className="flex items-center gap-3 w-full px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all">
            <LogOut size={20} />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 shadow-sm">
           <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-slate-800">Panel de Control</h2>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-100">
                v1.0.0
              </span>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                 <p className="text-sm font-semibold text-slate-700">Admin User</p>
                 <p className="text-xs text-gray-500">admin@techstore.com</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
                A
              </div>
           </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {children} 
        </main>
        
      </div>
    </div>
  );
}
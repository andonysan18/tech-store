import { AdminSidebar } from "@/src/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* SIDEBAR COMPONENTIZADO */}
      <AdminSidebar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto">
           {children}
        </div>
      </main>
      
    </div>
  );
}
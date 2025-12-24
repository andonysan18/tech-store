"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; 
import { 
  Search, ShoppingBag, User, Heart, Menu, 
  Smartphone, Gamepad2, Headphones, Zap, X, Wrench 
} from "lucide-react";

import { useCartStore } from "@/src/store/cart-store";
import { useFavoritesStore } from "@/src/store/favorites-store"; 

import { Input } from "@/src/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/src/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { Badge } from "@/src/components/ui/badge";

export function Navbar() {
  const pathname = usePathname();
  const [isPromoOpen, setIsPromoOpen] = useState(true);
  
  // Estado de montaje para evitar errores de hidratación
  const [mounted, setMounted] = useState(false);

  // Stores
  const totalItems = useCartStore((state) => state.getTotalItems());
  const favoriteItems = useFavoritesStore((state) => state.items);
  const totalFavorites = favoriteItems.length;
  
  // Buscador
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  // Lógica Admin: Si estamos en admin, retornamos null AHORA (evita renderizar nada)
  // Nota: Esto es seguro siempre y cuando el layout de admin no espere este navbar.
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      
      {/* 1. TOP BAR */}
      {isPromoOpen && (
        <div className="bg-slate-900 text-white text-xs md:text-sm py-2 px-4 flex justify-between items-center transition-all">
          <p className="mx-auto font-medium text-center">
            🚀 <span className="text-yellow-400 font-bold">ENVÍO GRATIS</span> en compras mayores a $50.000
          </p>
          <button onClick={() => setIsPromoOpen(false)} className="text-gray-400 hover:text-white ml-2">
            <X size={16} />
          </button>
        </div>
      )}

      {/* 2. BARRA PRINCIPAL */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg transform group-hover:-rotate-12 transition duration-300">
            <Zap size={24} fill="currentColor" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-800">
            Tech<span className="text-blue-600">Store</span>
          </span>
        </Link>

        {/* Buscador Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
          <Input 
            type="text" 
            placeholder="Buscar iPhone, fundas, cargadores..." 
            className="w-full bg-gray-100 border-transparent focus:bg-white rounded-full py-5 pl-5 pr-12 text-sm shadow-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-1.5 top-1.5 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
            <Search size={18} />
          </button>
        </form>

        {/* Iconos */}
        <div className="flex items-center gap-2 md:gap-4 text-slate-600">
          
          {/* Favoritos Desktop */}
          <Link href="/favorites" className="hidden md:flex flex-col items-center hover:text-blue-600 transition group relative">
            <div className="relative">
                <Heart size={24} className="group-hover:scale-110 transition" />
                {mounted && totalFavorites > 0 && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
                )}
            </div>
            <span className="text-[10px] font-medium mt-0.5">Favoritos</span>
          </Link>
          
          {/* --- CORRECCIÓN CLAVE AQUÍ --- */}
          {/* Si no está montado, mostramos solo el ícono estático para evitar error de ID Radix */}
          {!mounted ? (
             <div className="flex flex-col items-center opacity-70">
                <User size={24} />
                <span className="text-[10px] font-medium mt-0.5">Cuenta</span>
             </div>
          ) : (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex flex-col items-center hover:text-blue-600 transition group outline-none">
                    <User size={24} className="group-hover:scale-110 transition" />
                    <span className="text-[10px] font-medium mt-0.5">Cuenta</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Perfil</DropdownMenuItem>
                  <DropdownMenuItem>Mis Pedidos</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">Cerrar Sesión</DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
          )}

          {/* Carrito */}
          <Link href="/cart" className="flex flex-col items-center hover:text-blue-600 transition relative group">
            <div className="relative">
              <ShoppingBag size={24} className="group-hover:scale-110 transition" />
              {mounted && totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-600 border-2 border-white text-[10px] animate-in zoom-in">
                  {totalItems}
                </Badge>
              )}
            </div>
            <span className="text-[10px] font-medium mt-0.5">Carrito</span>
          </Link>

          {/* --- CORRECCIÓN CLAVE EN MENÚ MÓVIL --- */}
          {!mounted ? (
             <button className="md:hidden ml-2 text-slate-800">
                <Menu size={28} />
             </button>
          ) : (
             <Sheet>
               <SheetTrigger asChild>
                 <button className="md:hidden ml-2 text-slate-800">
                   <Menu size={28} />
                 </button>
               </SheetTrigger>
               <SheetContent side="left">
                 <SheetHeader>
                   <SheetTitle className="flex items-center gap-2">
                       <Zap size={20} className="text-blue-600" fill="currentColor"/> 
                       Menú
                   </SheetTitle>
                 </SheetHeader>
                 
                 <div className="flex flex-col gap-4 mt-6">
                   <form onSubmit={handleSearch}>
                       <Input 
                           placeholder="Buscar productos..." 
                           className="bg-slate-100" 
                           value={query}
                           onChange={(e) => setQuery(e.target.value)}
                       />
                   </form>
                   
                   <nav className="flex flex-col gap-2">
                       <Link href="/category/celulares" className="flex items-center gap-3 p-3 hover:bg-slate-100 rounded-lg text-lg font-medium">
                           <Smartphone size={20} className="text-blue-500"/> Celulares
                       </Link>
                       <Link href="/category/consolas" className="flex items-center gap-3 p-3 hover:bg-slate-100 rounded-lg text-lg font-medium">
                           <Gamepad2 size={20} className="text-purple-500"/> Gaming
                       </Link>
                       <Link href="/category/accesorios" className="flex items-center gap-3 p-3 hover:bg-slate-100 rounded-lg text-lg font-medium">
                           <Headphones size={20} className="text-green-500"/> Accesorios
                       </Link>
                       <Link href="/favorites" className="flex items-center gap-3 p-3 hover:bg-slate-100 rounded-lg text-lg font-medium">
                           <div className="relative">
                               <Heart size={20} className="text-red-500"/>
                               {mounted && totalFavorites > 0 && (
                                   <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-600 rounded-full ring-1 ring-white"></span>
                               )}
                           </div>
                           Mis Favoritos
                       </Link>
                       <Link href="/seguimiento" className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg text-lg font-medium mt-2">
                           <Wrench size={20}/> Reparaciones
                       </Link>
                   </nav>
                 </div>
               </SheetContent>
             </Sheet>
          )}

        </div>
      </div>

      {/* 3. MENÚ DE CATEGORÍAS */}
      <div className="border-t border-gray-100 hidden md:block">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-8 text-sm font-medium text-slate-600 h-12">
            <li><Link href="/category/celulares" className="flex items-center gap-2 hover:text-blue-600 transition"><Smartphone size={18} /> Celulares</Link></li>
            <li><Link href="/category/consolas" className="flex items-center gap-2 hover:text-blue-600 transition"><Gamepad2 size={18} /> Gaming & Consolas</Link></li>
            <li><Link href="/category/audio" className="flex items-center gap-2 hover:text-blue-600 transition"><Headphones size={18} /> Audio</Link></li>
            <li className="flex-1"></li>
            <li><Link href="/offers" className="text-red-500 hover:text-red-600 flex items-center gap-1 font-semibold"><Zap size={16} fill="currentColor" /> Ofertas Flash</Link></li>
            <li><Link href="/seguimiento" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"><Wrench size={16} /> Estado de Reparación</Link></li>
          </ul>
        </div>
      </div>
    </header>
  );
}
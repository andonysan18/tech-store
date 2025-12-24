import Link from "next/link";
import Image from "next/image";
import { Zap, ArrowRight } from "lucide-react";

export function BentoGridCategories() {
  return (
    <section className="container mx-auto px-4">
      <div className="flex justify-between items-end mb-6">
         <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Explora por Categoría</h2>
         <Link href="/search" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
            Ver todo el catálogo <ArrowRight size={16} />
         </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[500px]">
        
        {/* Caja Grande 1: Gaming */}
        <Link href="/category/consolas" className="sm:col-span-2 md:row-span-2 relative group rounded-3xl overflow-hidden cursor-pointer h-[250px] md:h-auto">
           {/* Imagen real de Gaming */}
           <Image 
             src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800" 
             alt="Gaming" 
             fill 
             className="object-cover group-hover:scale-105 transition duration-700" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
             <span className="text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">Zona Gamer</span>
             <h3 className="text-white text-3xl font-bold leading-none mb-1">Consolas & PC</h3>
             <p className="text-slate-300 text-sm line-clamp-1">PlayStation, Xbox y periféricos de alto nivel.</p>
           </div>
        </Link>

        {/* Caja Mediana 2: Celulares */}
        <Link href="/category/celulares" className="sm:col-span-2 relative group rounded-3xl overflow-hidden cursor-pointer h-[200px] md:h-auto">
           <Image 
             src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800" 
             alt="Phones" 
             fill 
             className="object-cover group-hover:scale-105 transition duration-700" 
           />
           <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-500 p-8 flex flex-col justify-center">
             <h3 className="text-white text-2xl font-bold">Smartphones</h3>
             <p className="text-slate-200 text-sm">Lo último de Apple y Samsung.</p>
           </div>
        </Link>

        {/* Caja Chica 3: Audio */}
        <Link href="/category/audio" className="relative group rounded-3xl overflow-hidden cursor-pointer bg-slate-100 h-[200px] md:h-auto">
           <Image 
             src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600" 
             alt="Audio" 
             fill 
             className="object-cover group-hover:scale-110 transition duration-700" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
             <h3 className="text-white text-lg font-bold">Audio Hi-Fi</h3>
           </div>
        </Link>

        {/* Caja Chica 4: Accesorios (Sin foto, con icono) */}
        <Link href="/category/perifericos" className="relative group rounded-3xl overflow-hidden cursor-pointer bg-slate-900 h-[200px] md:h-auto border border-slate-800">
           <div className="absolute inset-0 flex items-center justify-center text-slate-700 group-hover:text-blue-500 transition duration-500">
              <Zap size={64} strokeWidth={1} />
           </div>
           <div className="absolute bottom-6 left-6">
             <h3 className="text-white text-lg font-bold">Periféricos</h3>
             <p className="text-slate-500 text-xs">Mejora tu setup</p>
           </div>
        </Link>

      </div>
    </section>
  )
}
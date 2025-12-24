import Link from "next/link";
import Image from "next/image";

export function LifestyleSection() {
  return (
    <section className="container mx-auto px-4">
       <div className="grid md:grid-cols-2 gap-8">
          
          {/* Colección 1: Home Office */}
          <div className="flex flex-col md:flex-row items-center gap-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition">
             <div className="w-full md:w-1/2 aspect-video relative rounded-2xl overflow-hidden shadow-inner">
                <Image 
                    src="https://images.unsplash.com/photo-1493723843684-a43684fd7615?auto=format&fit=crop&q=80&w=600" 
                    alt="Office" 
                    fill 
                    className="object-cover" 
                />
             </div>
             <div className="flex-1 text-center md:text-left">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Productividad</span>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 mt-1">Home Office Pro</h3>
                <p className="text-slate-500 mb-4 text-sm line-clamp-2">Mejora tu espacio de trabajo con teclados mecánicos, monitores y soportes ergonómicos.</p>
                <Link href="/category/computacion" className="text-slate-900 font-bold text-sm underline decoration-blue-500 underline-offset-4 hover:text-blue-600 transition">
                    Ver colección &rarr;
                </Link>
             </div>
          </div>

          {/* Colección 2: Creator Studio */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition">
             <div className="w-full md:w-1/2 aspect-video relative rounded-2xl overflow-hidden shadow-inner">
                <Image 
                    src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=600" 
                    alt="Creator" 
                    fill 
                    className="object-cover" 
                />
             </div>
             <div className="flex-1 text-center md:text-left">
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Streaming</span>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 mt-1">Creador de Contenido</h3>
                <p className="text-slate-500 mb-4 text-sm line-clamp-2">Micrófonos, cámaras e iluminación RGB para llevar tu stream al siguiente nivel.</p>
                <Link href="/category/perifericos" className="text-slate-900 font-bold text-sm underline decoration-purple-500 underline-offset-4 hover:text-purple-600 transition">
                    Ver colección &rarr;
                </Link>
             </div>
          </div>

       </div>
    </section>
  )
}
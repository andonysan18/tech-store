import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/src/lib/db"; 
import { ProductCard } from "@/src/components/products/product-card"; 
import { ArrowRight, Wrench, Zap, Smartphone, Headphones, Gamepad2, Battery, ShieldCheck, Laptop, Watch } from "lucide-react";

// Helper de iconos (se mantiene igual)
const getCategoryIcon = (slug: string) => {
  const icons: Record<string, any> = {
    celulares: <Smartphone />, smartphones: <Smartphone />, gaming: <Gamepad2 />, 
    consolas: <Gamepad2 />, audio: <Headphones />, accesorios: <Battery />, 
    cargadores: <Zap />, fundas: <ShieldCheck />, laptops: <Laptop />, relojes: <Watch />,
  };
  return icons[slug.toLowerCase()] || <Zap />; 
};

export default async function Home() {
  // 🔥 CONSULTAS PARALELAS OPTIMIZADAS
  const [featuredProducts, categories, heroProduct] = await Promise.all([
    
    // 1. Productos Destacados
    // IMPORTANTE: Incluimos 'variants' para sacar precio y foto
    prisma.product.findMany({
      where: { isFeatured: true },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { 
        category: true,
        variants: true // <--- NECESARIO PARA PRECIO Y FOTO
      }, 
    }),

    // 2. Categorías
    prisma.category.findMany({
      take: 6,
      orderBy: { products: { _count: 'desc' } } 
    }),

    // 3. Producto Hero (Usamos el slug que pusimos en el seed: 'ps5-standard')
    prisma.product.findUnique({
      where: { slug: 'ps5-standard' }, 
      include: { 
        category: true,
        variants: true 
      }
    })
  ]);

  // Lógica para extraer datos del Hero Product (si existe)
  const heroVariant = heroProduct?.variants[0]; // Tomamos la primera variante
  const heroPrice = heroVariant?.price ? Number(heroVariant.price) : 0;
  const heroImage = heroVariant?.images[0] || null;

  return (
    <div className="flex flex-col gap-12 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-slate-900 opacity-90"></div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="container mx-auto px-4 py-20 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          
          {/* Texto Hero */}
          <div className="space-y-6">
            <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Nuevo Stock</span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Tecnología que <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">mueve tu mundo</span></h1>
            <p className="text-slate-300 text-lg max-w-md">Expertos en venta y servicio técnico certificado.</p>
            <div className="flex flex-wrap gap-4">
              <Link href={categories.length > 0 ? `/category/${categories[0].slug}` : '/search'} className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition flex items-center gap-2">Ver Tienda <ArrowRight size={20} /></Link>
              <Link href="/reparaciones" className="border border-slate-600 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition flex items-center gap-2"><Wrench size={20} /> Reparar Equipo</Link>
            </div>
          </div>
          
          {/* Tarjeta Hero Dinámica */}
          <div className="hidden md:block relative">
             {heroProduct && heroVariant ? (
                <Link href={`/product/${heroProduct.slug}`} className="block group">
                  <div className="relative bg-gradient-to-b from-slate-800 to-slate-950 rounded-3xl p-8 border border-slate-700 shadow-2xl transform rotate-3 group-hover:rotate-0 group-hover:scale-[1.02] transition duration-500 cursor-pointer">
                      
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold line-clamp-1">{heroProduct.name}</h3>
                          <p className="text-slate-400 text-sm">{heroProduct.category?.name || 'Gaming'}</p>
                        </div>
                        <span className="bg-green-500 text-slate-950 font-bold px-3 py-1 rounded-lg">
                          ${heroPrice.toLocaleString("es-AR")}
                        </span>
                      </div>

                      <div className="h-64 bg-slate-800/50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-700 relative overflow-hidden">
                        {heroImage ? (
                            <Image 
                              src={heroImage} 
                              alt={heroProduct.name} 
                              fill 
                              className="object-cover group-hover:scale-105 transition duration-500"
                            />
                        ) : (
                            <Gamepad2 size={64} className="text-slate-600 group-hover:text-blue-500 transition duration-500" />
                        )}
                      </div>
                  </div>
                </Link>
             ) : (
                /* Fallback de diseño si no hay producto */
                <div className="relative bg-gradient-to-b from-slate-800 to-slate-950 rounded-3xl p-8 border border-slate-700 shadow-2xl transform rotate-3">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold">PlayStation 5</h3>
                        <p className="text-slate-400">Digital Edition</p>
                      </div>
                      <span className="bg-slate-700 text-slate-300 font-bold px-3 py-1 rounded-lg">Agotado</span>
                    </div>
                    <div className="h-64 bg-slate-800/50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-700">
                      <Gamepad2 size={64} className="text-slate-600" />
                    </div>
                </div>
             )}
          </div>
        </div>
      </section>

      {/* 2. CATEGORÍAS */}
      <section className="container mx-auto px-4">
        <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2"><Zap className="text-yellow-500" /> ¿Qué estás buscando hoy?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} icon={getCategoryIcon(cat.slug)} label={cat.name} href={`/category/${cat.slug}`} color="bg-blue-50 text-blue-600" />
            ))}
             <CategoryCard icon={<ArrowRight />} label="Ver todo" href="/search" color="bg-gray-100 text-gray-600" />
        </div>
      </section>

      {/* 3. PRODUCTOS DESTACADOS */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Destacados de la semana</h2>
          <Link href="/search" className="text-blue-600 font-semibold hover:underline">Ver todo</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => {
            // Lógica para sacar precio y stock de las variantes
            const mainVariant = product.variants[0];
            const displayPrice = mainVariant ? Number(mainVariant.price) : 0;
            const displayImage = mainVariant?.images[0] || "https://placehold.co/600x400?text=No+Image";
            const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);

            return (
              <ProductCard 
                key={product.id} 
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: displayPrice,
                  image: displayImage,
                  stock: totalStock,
                  category: product.category.name,
                  condition: mainVariant?.condition || "NEW",
                  specs: (product.specs as { ram?: string; screen?: string }) || {}
                }} 
              />
            );
          })}
        </div>
      </section>

      {/* 4. BANNER SERVICIO TÉCNICO */}
      <section className="container mx-auto px-4 mt-8">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          {/* Patrón de fondo CSS puro para evitar imagen externa lenta */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="max-w-xl relative z-10">
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Tu equipo dejó de funcionar?</h2>
             <p className="text-slate-300 text-lg mb-8">
               No lo tires. Nuestros técnicos certificados pueden revivirlo en menos de 24hs. Diagnóstico sin cargo.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
               <Link href="/reparaciones" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-500 transition flex justify-center items-center">
                 Agendar Cita
               </Link>
               <Link href="/reparaciones/seguimiento" className="bg-transparent border border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-slate-900 transition flex items-center justify-center">
                 Consultar Estado
               </Link>
             </div>
          </div>
          <div className="bg-white/10 p-6 rounded-full backdrop-blur-sm relative z-10">
             <Wrench size={80} className="text-blue-400" />
          </div>
        </div>
      </section>

    </div>
  );
}

// Componente simple para categorías
function CategoryCard({ icon, label, href, color }: { icon: any, label: string, href: string, color: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white border border-gray-100 hover:shadow-md hover:border-blue-100 transition group">
      <div className={`p-4 rounded-full ${color} group-hover:scale-110 transition duration-300`}>{icon}</div>
      <span className="font-medium text-slate-700 text-sm text-center">{label}</span>
    </Link>
  )
}
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/src/lib/db"; 
import { ProductCard } from "@/src/components/products/product-card"; 
import { ArrowRight, Wrench, Gamepad2 } from "lucide-react";

// Importamos los nuevos componentes visuales
import { BenefitsBar } from "@/src/components/home/benefits-bar";
import { BentoGridCategories } from "@/src/components/home/bento-grid";
import { LifestyleSection } from "@/src/components/home/lifestyle-section";

// 👇 ESTA LÍNEA SOLUCIONA TU PROBLEMA DE VERCEL
// Obliga a que la página se renderice de nuevo en cada visita (Server Side Rendering real).
export const dynamic = "force-dynamic";

export default async function Home() {
  // 🔥 CONSULTAS PARALELAS
  const [featuredProducts, heroProduct] = await Promise.all([
    // 1. Productos Destacados
    prisma.product.findMany({
      where: { isFeatured: true },
      take: 8, // Traemos 8 para llenar dos filas si es necesario
      orderBy: { createdAt: 'desc' },
      include: { 
        category: true,
        brand: true,
        variants: true 
      }, 
    }),

    // 2. Producto Hero (PlayStation 5)
    prisma.product.findUnique({
      where: { slug: 'ps5-standard' }, 
      include: { 
        category: true,
        variants: true 
      }
    })
  ]);

  // Lógica para Hero
  const heroVariant = heroProduct?.variants[0];
  const heroPrice = heroVariant?.price ? Number(heroVariant.price) : 0;
  // Usamos una imagen de Unsplash si no hay foto en DB para que el Hero se vea bien siempre
  const heroImage = heroVariant?.images[0] || "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=1000";

  return (
    <div className="flex flex-col gap-16 pb-20 bg-gray-50/50">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-slate-900 opacity-90"></div>
        {/* Círculos decorativos de fondo */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-1.5 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Nuevo Stock Disponible</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Tecnología que <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                potencia tu mundo
              </span>
            </h1>
            
            <p className="text-slate-400 text-lg max-w-md leading-relaxed">
              Encuentra lo último en gadgets, gaming y computación. Servicio técnico certificado y garantía oficial.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/search" className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-blue-500/20 hover:scale-105 active:scale-95">
                Ver Tienda <ArrowRight size={20} />
              </Link>
              <Link href="/repair" className="border border-slate-700 bg-slate-800/50 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition flex items-center gap-2 backdrop-blur-sm">
                <Wrench size={20} /> Servicio Técnico
              </Link>
            </div>
          </div>
          
          {/* Tarjeta Hero */}
          <div className="hidden md:block relative animate-in slide-in-from-right duration-700 delay-200">
             {heroProduct && heroVariant ? (
                <Link href={`/product/${heroProduct.slug}`} className="block group perspective-1000">
                  <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-[2.5rem] p-8 border border-slate-700/50 shadow-2xl transform rotate-3 group-hover:rotate-0 group-hover:scale-[1.02] transition-all duration-500 cursor-pointer ease-out">
                      
                      {/* Efecto brillo */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-[2.5rem] pointer-events-none"></div>

                      <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                          <h3 className="text-3xl font-bold line-clamp-1 tracking-tight">{heroProduct.name}</h3>
                          <p className="text-slate-400 font-medium">{heroProduct.category?.name || 'Gaming'}</p>
                        </div>
                        <span className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl shadow-lg shadow-blue-900/50">
                          ${heroPrice.toLocaleString("es-AR")}
                        </span>
                      </div>

                      <div className="h-72 w-full rounded-2xl relative flex items-center justify-center overflow-hidden group-hover:shadow-2xl transition-all">
                        {/* Círculo de fondo detrás del producto */}
                        <div className="absolute w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                        
                        <Image 
                            src={heroImage} 
                            alt={heroProduct.name} 
                            fill 
                            className="object-contain p-2 group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl" 
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                  </div>
                </Link>
             ) : (
                /* Fallback (Diseño vacío) */
                <div className="h-96 w-full bg-slate-800 rounded-3xl flex items-center justify-center border border-slate-700 border-dashed">
                    <Gamepad2 size={64} className="text-slate-600" />
                </div>
             )}
          </div>
        </div>
      </section>

      {/* 2. BARRA DE BENEFICIOS (Nuevo) */}
      <BenefitsBar />

      {/* 3. GRID BENTO (Nuevo) */}
      <BentoGridCategories />

      {/* 4. PRODUCTOS DESTACADOS */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Destacados de la semana</h2>
            <p className="text-slate-500 mt-2">Las mejores ofertas seleccionadas para vos.</p>
          </div>
          <Link href="/offers" className="text-blue-600 font-bold hover:underline flex items-center gap-1">
            Ver todas las ofertas <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => {
            const mainVariant = product.variants[0];
            const displayPrice = mainVariant ? Number(mainVariant.price) : 0;
            const displayImage = mainVariant?.images[0] || "https://placehold.co/600x400?text=No+Image";
            const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);

            return (
              <ProductCard 
                key={product.id} 
                product={{
                  id: product.id,
                  variantId: mainVariant?.id, 
                  name: product.name,
                  slug: product.slug,
                  price: displayPrice,
                  image: displayImage,
                  stock: totalStock,
                  category: product.category.name,
                  condition: mainVariant?.condition || "NEW",
                  specs: (product.specs as { ram?: string; screen?: string }) || {},
                  brand: product.brand,
                  discount: product.discount
                }} 
              />
            );
          })}
        </div>
      </section>

      {/* 5. LIFESTYLE (Nuevo) */}
      <LifestyleSection />

      {/* 6. BANNER SERVICIO TÉCNICO */}
      <section className="container mx-auto px-4 mt-8">
        <div className="bg-slate-950 rounded-[2.5rem] p-8 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group">
          
          {/* Fondo técnico animado */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#60a5fa 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20 group-hover:opacity-30 transition duration-1000"></div>

          <div className="max-w-xl relative z-10">
              <span className="inline-block py-1 px-3 rounded-lg bg-blue-900/50 border border-blue-800 text-blue-300 text-xs font-bold uppercase mb-4">
                Servicio Técnico Certificado
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                ¿Tu equipo <span className="text-blue-500">murió</span>? <br/> Nosotros lo revivimos.
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Diagnóstico en 24hs, repuestos originales y garantía escrita. Especialistas en Apple, PC Gaming y Consolas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/repair" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30 transition flex justify-center items-center">
                  Agendar Reparación
                </Link>
                <Link href="/repair/tracking" className="bg-transparent border border-slate-700 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition flex items-center justify-center">
                  Seguir mi equipo
                </Link>
              </div>
          </div>
          
          <div className="relative z-10 transform md:rotate-6 group-hover:rotate-0 transition duration-500">
              <div className="bg-slate-800/80 p-8 rounded-[2rem] border border-slate-700 backdrop-blur-xl shadow-2xl">
                 <Wrench size={100} className="text-blue-500 drop-shadow-lg" />
              </div>
          </div>
        </div>
      </section>

    </div>
  );
}
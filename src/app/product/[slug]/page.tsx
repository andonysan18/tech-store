import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/src/lib/db";
import { ProductGallery } from "@/src/components/products/product-gallery"; 
import { Badge } from "@/src/components/ui/badge";
import { 
  ShieldCheck, Truck, ArrowLeft, Zap, Cpu, Layers, Smartphone, RefreshCw 
} from "lucide-react";
import { AddToCart } from "@/src/components/products/add-to-cart";
import { FavoriteButton } from "@/src/components/products/favorite-button";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // 1. Buscamos el producto Y sus variantes
  const product = await prisma.product.findUnique({
    where: { slug: slug },
    include: { 
      category: true, 
      brand: true,
      variants: true // <--- ¡CRÍTICO! Traemos las variantes
    },
  });

  if (!product) return notFound();

  // 2. Lógica de "Variante por Defecto"
  // En un e-commerce real, aquí podrías tener lógica para seleccionar por color si viene en la URL
  // Por ahora, tomamos la primera variante disponible como la "principal".
  const defaultVariant = product.variants[0];

  // Si el producto existe pero no tiene variantes (error de carga de datos), manejamos fallback
  if (!defaultVariant) {
    return (
       <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold">Producto no disponible temporalmente</h1>
          <p>No se encontraron variantes para este producto.</p>
          <Link href="/" className="text-blue-600 underline">Volver al inicio</Link>
       </div>
    );
  }

  // 3. Extracción de datos para la UI
  const specs = (product.specs as Record<string, string>) || {};
  
  // Datos que ahora viven en la VARIANTE:
  const priceNumber = Number(defaultVariant.price);
  const stock = defaultVariant.stock;
  const condition = defaultVariant.condition;
  
  // Las imágenes también viven en la variante ahora
  const images = defaultVariant.images || [];
  const mainImage = images.length > 0 ? images[0] : "/placeholder.png";

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* NAVEGACIÓN SUPERIOR */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-20 backdrop-blur-md bg-white/80">
        <div className="container mx-auto px-4 h-14 flex items-center gap-2 text-sm">
          <Link href="/" className="text-slate-500 hover:text-slate-900 transition flex items-center gap-1">
             <ArrowLeft size={14} /> Tienda
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">{product.category.name}</span>
          <span className="text-slate-300">/</span>
          <span className="font-medium text-slate-900 truncate">{product.name}</span>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* --- COLUMNA IZQUIERDA: FOTOS Y DESCRIPCIÓN --- */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            
            {/* Galería de Imágenes */}
            <div className="bg-slate-50 rounded-2xl p-2 border border-slate-100">
               {/* Usamos las imágenes de la variante */}
               {images.length > 0 ? (
                  <ProductGallery images={images} />
               ) : (
                  <div className="relative aspect-video w-full flex items-center justify-center">
                    <img src="/placeholder.png" alt={product.name} className="object-contain max-h-[400px]" />
                  </div>
               )}
            </div>

            {/* Descripción */}
            <div>
               <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Layers className="text-blue-600"/> Descripción
               </h3>
               <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  {product.description || "Sin descripción disponible."}
               </div>
            </div>

            {/* Ficha Técnica (Specs) */}
            {Object.keys(specs).length > 0 && (
             <div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Cpu className="text-purple-600"/> Ficha Técnica
                 </h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Mostramos también datos clave de la variante seleccionada */}
                    {defaultVariant.storage && (
                       <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col gap-1">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Almacenamiento</span>
                          <span className="font-semibold text-slate-800">{defaultVariant.storage}</span>
                       </div>
                    )}
                     {defaultVariant.color && (
                       <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col gap-1">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Color</span>
                          <span className="font-semibold text-slate-800">{defaultVariant.color}</span>
                       </div>
                    )}

                    {Object.entries(specs).map(([key, value]) => (
                       <div key={key} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col gap-1 hover:border-blue-200 transition-colors">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{key}</span>
                          <span className="font-semibold text-slate-800 break-words">{value}</span>
                       </div>
                    ))}
                 </div>
             </div>
            )}
          </div>

          {/* --- COLUMNA DERECHA: PRECIO Y COMPRA --- */}
          <div className="lg:col-span-4">
             <div className="sticky top-20 flex flex-col gap-6">
                
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                    
                    {/* Header: Marca y Condición */}
                    <div className="flex justify-between items-start mb-4">
                       <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">
                          {product.brand.name}
                       </Badge>
                       <Badge variant="outline" className={`${condition === 'NEW' ? 'text-green-600 border-green-200 bg-green-50' : 'text-orange-600 border-orange-200 bg-orange-50'}`}>
                          {condition === 'NEW' ? 'Nuevo' : 'Reacondicionado'}
                       </Badge>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-2">
                       {product.name}
                       {/* Mostramos detalles de la variante en el título para claridad */}
                       {defaultVariant.storage && <span className="text-slate-400 font-normal ml-2 text-lg">{defaultVariant.storage}</span>}
                    </h1>
                    
                    {defaultVariant.color && (
                      <p className="text-slate-500 text-sm font-medium mb-4">Color: {defaultVariant.color}</p>
                    )}

                    {/* Precios */}
                    <div className="mt-4 mb-6">
                       <p className="text-sm text-slate-400 line-through mb-1">
                          ${(priceNumber * 1.15).toLocaleString("es-AR")}
                       </p>
                       <div className="flex items-center gap-2">
                          <span className="text-4xl font-extrabold text-slate-900">
                             ${priceNumber.toLocaleString("es-AR")}
                          </span>
                          <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                            -15% OFF
                          </span>
                       </div>
                    </div>

                    {/* Stock */}
                    <div className="flex items-center gap-2 mb-6 text-sm">
                       {stock > 0 ? (
                          <>
                             <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                             <span className="text-green-700 font-medium">Stock disponible hoy</span>
                          </>
                       ) : (
                          <>
                             <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                             <span className="text-red-700 font-medium">Agotado temporalmente</span>
                          </>
                       )}
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex flex-col gap-3">
                       
                       {/* 1. Agregar al Carrito */}
                       {/* IMPORTANTE: Pasamos el ID de la VARIANTE, no del producto */}
                       <AddToCart 
                         product={{
                             id: defaultVariant.id, // <--- ID de Variante para el Schema V2
                             name: `${product.name} ${defaultVariant.storage || ''}`,
                             price: priceNumber, 
                             image: mainImage,
                             stock: stock
                         }}
                       />
                       
                       {/* 2. Favoritos */}
                       <FavoriteButton 
                         product={{
                             id: product.id, // Favoritos suele ser al producto general, no a la variante
                             name: product.name,
                             price: priceNumber, 
                             image: mainImage,
                             stock: stock,
                             condition: condition,
                             category: product.category.name,
                             brand: { name: product.brand.name }
                         }}
                       />
                    </div>

                    {/* Iconos de confianza */}
                    <div className="mt-6 grid grid-cols-2 gap-2 text-xs text-slate-500">
                       <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg text-center">
                          <Truck className="mb-1 text-slate-900" size={18}/> 
                          <span>Envío Gratis</span>
                       </div>
                       <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg text-center">
                          <ShieldCheck className="mb-1 text-slate-900" size={18}/> 
                          <span>Garantía 12m</span>
                       </div>
                       <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg text-center">
                          <RefreshCw className="mb-1 text-slate-900" size={18}/> 
                          <span>Devolución</span>
                       </div>
                       <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg text-center">
                          <Zap className="mb-1 text-slate-900" size={18}/> 
                          <span>Entrega Fast</span>
                       </div>
                    </div>
                </div>

                {/* Banner de ayuda */}
                <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center gap-4">
                   <div className="bg-white/10 p-3 rounded-full">
                      <Smartphone size={24} />
                   </div>
                   <div>
                      <p className="font-bold text-sm">¿Dudas con el equipo?</p>
                      <p className="text-xs text-slate-300">Habla con un experto tech.</p>
                   </div>
                </div>

             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
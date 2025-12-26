import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/src/lib/db"; 
import { ProductGallery } from "@/src/components/products/product-gallery"; 
import { Badge } from "@/src/components/ui/badge";
// 👇 Agregué MessageCircle aquí
import { ShieldCheck, Truck, ArrowLeft, Zap, Layers, Cpu, Smartphone, RefreshCw, MessageCircle } from "lucide-react";
import { AddToCart } from "@/src/components/products/add-to-cart";
import { FavoriteButton } from "@/src/components/products/favorite-button";
import { VariantSelector } from "@/src/components/products/variant-selector";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sku?: string }>;
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params;
  const { sku } = await searchParams;

  // 1. Buscamos el producto
  const product = await prisma.product.findUnique({
    where: { slug: slug },
    include: { 
      category: true, 
      brand: true,
      variants: {
        orderBy: { price: 'asc' }
      }
    },
  });

  if (!product) return notFound();

  // 2. Lógica de Variante
  let selectedVariant = product.variants.find(v => v.sku === sku);
   
  if (!selectedVariant) {
      selectedVariant = product.variants[0];
  }

  if (!selectedVariant) {
    return <div className="p-10 text-center">Producto sin stock disponible.</div>;
  }

  // 3. Datos calculados
  const specs = (product.specs as Record<string, string>) || {};
  const priceNumber = Number(selectedVariant.price);
   
  const hasDiscount = product.discount > 0;
  const originalPrice = hasDiscount 
      ? priceNumber / (1 - (product.discount / 100)) 
      : null;

  const images = selectedVariant.images || [];
  const mainImage = images.length > 0 ? images[0] : "/placeholder.png";

  const serializedVariants = product.variants.map(v => ({
    id: v.id,
    sku: v.sku,
    color: v.color,
    storage: v.storage,
    price: Number(v.price),
    stock: v.stock
  }));

  // 🔥 4. LÓGICA WHATSAPP (Nueva)
  // ⚠️ IMPORTANTE: Cambia este número por el del negocio (sin el +)
  const phoneNumber = "5491123456789"; 
  
  const messageText = `Hola! 👋 Estoy viendo el *${product.name}* (SKU: ${selectedVariant.sku}) por $${priceNumber.toLocaleString("es-AR")} y tengo una consulta.`;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageText)}`;

  return (
    <div className="bg-white min-h-screen pb-20">
       
      {/* NAVEGACIÓN */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-20 backdrop-blur-md bg-white/80">
        <div className="container mx-auto px-4 h-14 flex items-center gap-2 text-sm">
          <Link href="/" className="text-slate-500 hover:text-slate-900 flex items-center gap-1">
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
           
          {/* FOTOS */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            <div className="bg-slate-50 rounded-2xl p-2 border border-slate-100">
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
               <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed bg-white p-6 rounded-2xl border border-slate-100 shadow-sm whitespace-pre-wrap">
                  {product.description}
               </div>
            </div>

            {/* Ficha Técnica */}
            {Object.keys(specs).length > 0 && (
             <div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Cpu className="text-purple-600"/> Ficha Técnica
                 </h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col gap-1">
                       <span className="text-xs font-bold text-slate-400 uppercase">Modelo</span>
                       <span className="font-semibold text-slate-800 truncate">{selectedVariant.sku}</span>
                    </div>
                    {Object.entries(specs).map(([key, value]) => (
                       <div key={key} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col gap-1">
                          <span className="text-xs font-bold text-slate-400 uppercase">{key}</span>
                          <span className="font-semibold text-slate-800">{value}</span>
                       </div>
                    ))}
                 </div>
             </div>
            )}
          </div>

          {/* DERECHA: DATOS Y COMPRA */}
          <div className="lg:col-span-4">
             <div className="sticky top-20 flex flex-col gap-6">
                
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                    
                    <div className="flex justify-between items-start mb-4">
                       <Badge variant="secondary">{product.brand.name}</Badge>
                       <Badge variant="outline" className={selectedVariant.condition === 'NEW' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'}>
                          {selectedVariant.condition === 'NEW' ? 'Nuevo' : 'Reacondicionado'}
                       </Badge>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-2">
                       {product.name}
                    </h1>
                    
                    {/* PRECIOS DINÁMICOS */}
                    <div className="mt-4 mb-6">
                       {hasDiscount && originalPrice && (
                           <div className="flex items-center gap-2 mb-1">
                               <p className="text-sm text-slate-400 line-through">
                                 ${originalPrice.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                               </p>
                               <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
                                 {product.discount}% OFF
                               </Badge>
                           </div>
                       )}
                       <span className="text-4xl font-extrabold text-slate-900">
                          ${priceNumber.toLocaleString("es-AR")}
                       </span>
                    </div>

                    <VariantSelector variants={serializedVariants} />

                    {/* STOCK */}
                    <div className="flex items-center gap-2 mb-6 text-sm">
                       {selectedVariant.stock > 0 ? (
                          <>
                             <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                             <span className="text-green-700 font-medium">
                                Stock disponible ({selectedVariant.stock} un.)
                             </span>
                          </>
                       ) : (
                          <>
                             <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                             <span className="text-red-700 font-medium">Sin stock por el momento</span>
                          </>
                       )}
                    </div>

                    <div className="flex flex-col gap-3">
                       <AddToCart 
                         product={{
                             id: selectedVariant.id,
                             name: `${product.name} ${selectedVariant.color || ''}`,
                             price: priceNumber, 
                             image: mainImage,
                             stock: selectedVariant.stock
                         }}
                       />
                       <FavoriteButton 
                         product={{
                             id: product.id,
                             name: product.name,
                             price: priceNumber, 
                             image: mainImage,
                             stock: selectedVariant.stock,
                             condition: selectedVariant.condition,
                             category: product.category.name,
                             brand: { name: product.brand.name }
                         }}
                       />

                       {/* 🔥 BOTÓN WHATSAPP NUEVO 🔥 */}
                       <a 
                         href={whatsappUrl}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg active:scale-95 mt-2"
                       >
                         <MessageCircle size={20} className="fill-current" />
                         Consultar con un experto
                       </a>

                    </div>

                    {/* Iconos estáticos */}
                    <div className="mt-6 grid grid-cols-2 gap-2 text-xs text-slate-500">
                       <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg text-center">
                          <Truck className="mb-1 text-slate-900" size={18}/> 
                          <span>Envío a todo el país</span>
                       </div>
                       <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg text-center">
                          <ShieldCheck className="mb-1 text-slate-900" size={18}/> 
                          <span>Garantía Oficial</span>
                       </div>
                    </div>
                </div>

             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ⬅️ IMPORTANTE
import { Plus, X, Save, ArrowLeft, Image as ImageIcon, UploadCloud, Trash2, Star, Percent, Sparkles, RefreshCw, Pencil, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Badge } from "@/src/components/ui/badge";
import { CldUploadWidget } from "next-cloudinary";

// Actions
import { createProductAction } from "@/src/actions/products/create-product-action";
import { updateProductAction } from "@/src/actions/products/update-product-action";

// Helpers
const cleanText = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
const slugify = (text: string) => text.toString().toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");

const CATEGORY_SPECS: Record<string, string[]> = {
  "celulares": ["Pantalla", "Cámara Trasera", "Cámara Frontal", "Procesador", "Batería", "Almacenamiento", "RAM", "Sistema Operativo"],
  "computacion": ["Procesador", "RAM", "Almacenamiento SSD", "Tarjeta Gráfica", "Pantalla", "Batería", "Peso"],
  "consolas": ["Resolución Máxima", "Almacenamiento", "FPS", "Conectividad", "Incluye Juegos", "Controles"],
  "audio": ["Tipo", "Cancelación de Ruido", "Duración Batería", "Conectividad", "Resistencia al Agua", "Micrófono"],
  "perifericos": ["Conexión", "DPI (Mouse)", "Tipo de Teclas", "Iluminación RGB", "Compatibilidad"],
  "almacenamiento": ["Capacidad", "Velocidad de Lectura", "Velocidad de Escritura", "Interfaz"],
  "componentes-pc": ["Socket", "Frecuencia", "Consumo (W)", "Formato", "Memoria VRAM"],
  "default": ["Material", "Dimensiones", "Peso", "Garantía", "Color"]
};

// Tipos
interface VariantTemp {
  id?: number; 
  sku: string;
  price: number;
  stock: number;
  color: string;
  storage: string;
  image: string;
}

interface SpecTemp {
  key: string;
  value: string;
}

interface ProductFormProps {
  brands: { id: number; name: string }[];
  categories: { id: number; name: string; slug: string }[];
  product?: any;
}

export function ProductForm({ brands, categories, product }: ProductFormProps) {
  const router = useRouter(); // 🔥 Hook para redirigir
  const [isLoading, setIsLoading] = useState(false);

  // --- ESTADOS PRINCIPALES ---
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [description, setDescription] = useState(product?.description || "");
  const [brandId, setBrandId] = useState(product?.brandId?.toString() || "");
  const [categoryId, setCategoryId] = useState(product?.categoryId?.toString() || "");
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);
  const [discount, setDiscount] = useState(product?.discount || 0);

  // Specs
  const initialSpecs = product?.specs 
    ? Object.entries(product.specs).map(([key, value]) => ({ key, value: String(value) })) 
    : [];
  const [specs, setSpecs] = useState<SpecTemp[]>(initialSpecs);
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });

  // --- LÓGICA DE VARIANTES ---
  const initialVariants = product?.variants?.map((v: any) => ({
    id: v.id,
    sku: v.sku,
    price: Number(v.price),
    stock: v.stock,
    color: v.color || "",
    storage: v.storage || "",
    image: v.images && v.images.length > 0 ? v.images[0] : ""
  })) || [];
  
  const [variants, setVariants] = useState<VariantTemp[]>(initialVariants);
  const [variantsToDelete, setVariantsToDelete] = useState<number[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [newVariant, setNewVariant] = useState<VariantTemp>({
    sku: "", price: 0, stock: 0, color: "", storage: "", image: ""
  });

  const [isSkuManual, setIsSkuManual] = useState(false);

  // --- SKU AUTOMÁTICO ---
  useEffect(() => {
    if (isSkuManual || editingIndex !== null) return;
    const n = cleanText(name).slice(0, 3) || "PRO";
    const c = cleanText(newVariant.color).slice(0, 3) || "GEN";
    const s = cleanText(newVariant.storage).slice(0, 3) || "000";
    setNewVariant(prev => ({ ...prev, sku: `${n}-${c}-${s}` }));
  }, [name, newVariant.color, newVariant.storage, isSkuManual, editingIndex]);

  // --- HANDLERS VARIANTES ---
  
  const handleSaveVariant = () => {
    if (newVariant.price <= 0) { alert("El precio es obligatorio."); return; }
    
    let finalSku = newVariant.sku.trim().toUpperCase();
    if (!finalSku) {
        const random = Math.floor(1000 + Math.random() * 9000);
        finalSku = `${cleanText(name).slice(0,3)}-${cleanText(newVariant.color).slice(0,3)}-${random}`;
    }

    const isDuplicate = variants.some((v, idx) => v.sku === finalSku && idx !== editingIndex);
    if (isDuplicate) {
        const random = Math.floor(1000 + Math.random() * 9000);
        finalSku = `${finalSku}-${random}`;
    }

    const variantToSave = { ...newVariant, sku: finalSku };

    if (editingIndex !== null) {
      const updatedVariants = [...variants];
      updatedVariants[editingIndex] = variantToSave;
      setVariants(updatedVariants);
      setEditingIndex(null);
    } else {
      setVariants([...variants, variantToSave]);
    }

    setNewVariant({ sku: "", price: 0, stock: 0, color: "", storage: "", image: "" });
    setIsSkuManual(false);
  };

  const handleEditVariant = (index: number) => {
    setNewVariant(variants[index]);
    setEditingIndex(index);
    setIsSkuManual(true);
    document.getElementById("variant-form")?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setNewVariant({ sku: "", price: 0, stock: 0, color: "", storage: "", image: "" });
    setEditingIndex(null);
    setIsSkuManual(false);
  };

  const removeVariant = (index: number) => {
    const variantToRemove = variants[index];
    if (variantToRemove.id) {
      setVariantsToDelete(prev => [...prev, variantToRemove.id!]);
    }
    if (editingIndex === index) {
      handleCancelEdit();
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const selectedCategory = categories.find(c => c.id.toString() === categoryId);
  const suggestedSpecs = selectedCategory ? (CATEGORY_SPECS[selectedCategory.slug] || CATEGORY_SPECS["default"]) : [];

  // --- SUBMIT (GUARDAR/ACTUALIZAR) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (variants.length === 0) { alert("Agrega al menos una variante."); return; }
    if (!slug) { alert("El slug es obligatorio"); return; }

    setIsLoading(true);

    const productData = { 
        name, slug, description, brandId, categoryId, variants, isFeatured, discount, specs,
        variantsToDelete 
    };

    let result;
    if (product) {
        result = await updateProductAction({ ...productData, id: product.id });
    } else {
        result = await createProductAction(productData);
    }

    if (result?.success) {
        // 🔥 FIX: Redirigir si salió bien
        router.push("/admin/products");
        router.refresh(); 
    } else {
        alert(result?.message || "Error desconocido");
        setIsLoading(false);
    }
  };

  // Handlers simples
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!product) setSlug(slugify(val));
  };
  const addSpec = () => { if(newSpec.key && newSpec.value) { setSpecs([...specs, newSpec]); setNewSpec({key:"", value:""}); }};
  const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button type="button" variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
                {product ? "Editar Producto" : "Nuevo Producto"}
            </h1>
            <p className="text-slate-500 text-sm">
                {product ? `Editando: ${product.name}` : "Ingresa los detalles, ficha técnica y variantes."}
            </p>
          </div>
        </div>
        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
          {isLoading ? "Guardando..." : <><Save size={18} className="mr-2"/> {product ? "Actualizar" : "Guardar"}</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-2 space-y-6">
          {/* INFO BÁSICA */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Información Básica</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Nombre del Producto</label>
                <Input placeholder="Ej: iPhone 15 Pro" value={name} onChange={handleNameChange} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Slug (URL)</label>
                <div className="flex gap-2">
                    <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="bg-slate-50 font-mono text-xs text-slate-500" />
                    <Button type="button" variant="outline" size="icon" onClick={() => setSlug(slugify(name))}><RefreshCw size={16}/></Button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Descripción</label>
                <Textarea placeholder="Descripción comercial..." className="min-h-[100px]" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
          </div>

          {/* FICHA TÉCNICA */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Ficha Técnica</h3>
            {categoryId && suggestedSpecs.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-1"><Sparkles size={12} className="text-yellow-500"/> Sugerencias:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedSpecs.map((sug) => (
                            <Badge key={sug} variant="outline" className="cursor-pointer hover:bg-blue-50" onClick={() => setNewSpec({...newSpec, key: sug})}>+ {sug}</Badge>
                        ))}
                    </div>
                </div>
            )}
            <div className="flex gap-2 items-end">
                <Input placeholder="Característica" value={newSpec.key} onChange={(e) => setNewSpec({...newSpec, key: e.target.value})} />
                <Input placeholder="Valor" value={newSpec.value} onChange={(e) => setNewSpec({...newSpec, value: e.target.value})} />
                <Button type="button" onClick={addSpec} variant="secondary"><Plus size={18} /></Button>
            </div>
            {specs.length > 0 && (
                <div className="bg-slate-50 rounded-lg p-2 space-y-1 mt-2">
                    {specs.map((spec, index) => (
                        <div key={index} className="flex justify-between text-sm p-2 hover:bg-white rounded">
                            <span className="font-medium text-slate-600">{spec.key}:</span>
                            <div className="flex gap-2"><span className="text-slate-800">{spec.value}</span><button type="button" onClick={() => removeSpec(index)}><Trash2 size={14} className="text-slate-400 hover:text-red-500"/></button></div>
                        </div>
                    ))}
                </div>
            )}
          </div>

          {/* VARIANTES (AREA DE EDICIÓN Y LISTADO) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="font-semibold text-slate-800">Variantes</h3>
                <Badge variant="secondary">{variants.length} agregadas</Badge>
            </div>
            
            {/* FORMULARIO DE VARIANTE */}
            <div id="variant-form" className={`p-4 rounded-lg border space-y-4 transition-colors ${editingIndex !== null ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
               
               {editingIndex !== null && (
                 <div className="flex items-center justify-between text-blue-700 mb-2">
                    <span className="text-xs font-bold flex items-center gap-1"><Pencil size={12}/> Editando variante #{editingIndex + 1}</span>
                    <button type="button" onClick={handleCancelEdit} className="text-xs underline hover:text-blue-900">Cancelar edición</button>
                 </div>
               )}

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1"><label className="text-xs font-bold text-slate-500">Color</label><Input placeholder="Negro" value={newVariant.color} onChange={(e) => setNewVariant({...newVariant, color: e.target.value})} /></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-slate-500">Almacenamiento</label><Input placeholder="128GB" value={newVariant.storage} onChange={(e) => setNewVariant({...newVariant, storage: e.target.value})} /></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-slate-500">Precio</label><Input type="number" placeholder="0.00" value={newVariant.price || ""} onChange={(e) => setNewVariant({...newVariant, price: parseFloat(e.target.value)})} /></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-slate-500">Stock</label><Input type="number" placeholder="0" value={newVariant.stock || ""} onChange={(e) => setNewVariant({...newVariant, stock: parseInt(e.target.value)})} /></div>
               </div>
               
               <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 space-y-1 w-full">
                    <label className="text-xs font-bold text-slate-500 uppercase flex justify-between">SKU {isSkuManual ? <button type="button" onClick={() => setIsSkuManual(false)} className="text-[10px] text-blue-500">Auto</button> : <span className="text-slate-400 font-normal">(auto)</span>}</label>
                    <Input placeholder="SKU" value={newVariant.sku} onChange={(e) => {setNewVariant({...newVariant, sku: e.target.value}); setIsSkuManual(true);}} className={isSkuManual ? "border-blue-200" : "bg-slate-50/50"}/>
                  </div>
                  <div className="flex-1 w-full">
                    <CldUploadWidget 
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} 
                        // 🔥 FIX: Usamos 'prev' para no perder precio, stock, etc. al subir la foto
                        onSuccess={(result: any) => {
                            setNewVariant(prev => ({ 
                                ...prev, 
                                image: result.info.secure_url 
                            }));
                        }}
                    >
                      {({ open }) => (
                        <Button type="button" variant="outline" onClick={() => open()} className="w-full border-2 border-dashed bg-white">
                          {newVariant.image ? <><CheckCircle2 size={16} className="mr-2 text-green-600"/> Cambiar Foto</> : <><UploadCloud size={16} className="mr-2" /> Subir Foto</>}
                        </Button>
                      )}
                    </CldUploadWidget>
                    {newVariant.image && <p className="text-[10px] text-green-600 mt-1 text-center">Imagen cargada correctamente</p>}
                  </div>
               </div>
               
               <Button 
                 type="button" 
                 onClick={handleSaveVariant} 
                 className={`w-full ${editingIndex !== null ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-800 hover:bg-slate-900'}`}
               >
                 {editingIndex !== null ? <><Save size={16} className="mr-2" /> Actualizar Variante</> : <><Plus size={16} className="mr-2" /> Agregar Variante</>}
               </Button>
            </div>

            {/* LISTA DE VARIANTES AGREGADAS */}
            <div className="space-y-2">
              {variants.map((v, index) => (
                <div key={index} className={`flex justify-between p-3 bg-white border rounded-lg shadow-sm ${editingIndex === index ? 'ring-2 ring-blue-500 border-transparent' : ''}`}>
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded bg-slate-100 overflow-hidden relative">
                        {v.image ? <img src={v.image} className="w-full h-full object-cover"/> : <ImageIcon size={16} className="m-auto text-slate-400 absolute inset-0"/>}
                    </div>
                    <div>
                        <p className="text-sm font-bold">{v.color} - {v.storage}</p>
                        <p className="text-xs text-slate-500">{v.sku}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="text-right">
                        <p className="text-sm font-bold text-green-600">${v.price}</p>
                        <p className="text-xs text-slate-500">{v.stock} un.</p>
                    </div>
                    
                    <div className="flex gap-1">
                        <Button type="button" size="icon" variant="ghost" onClick={() => handleEditVariant(index)} title="Editar">
                            <Pencil size={16} className="text-slate-400 hover:text-blue-600"/>
                        </Button>
                        <Button type="button" size="icon" variant="ghost" onClick={() => removeVariant(index)} title="Eliminar">
                            <X size={18} className="text-slate-400 hover:text-red-500"/>
                        </Button>
                    </div>
                  </div>
                </div>
              ))}
              {variants.length === 0 && <p className="text-center text-sm text-slate-400 py-4">No hay variantes agregadas todavía.</p>}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA (Configuración) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Configuración</h3>
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                <div className="space-y-0.5"><label className="text-sm font-medium flex items-center gap-2"><Star size={16} className="text-yellow-500 fill-yellow-500"/> Destacado</label></div>
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-5 w-5 accent-blue-600"/>
            </div>
            <div className="space-y-2 pt-2">
                <label className="text-sm font-medium flex gap-2"><Percent size={16}/> Descuento (%)</label>
                <div className="relative"><Input type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="pl-4"/><span className="absolute right-4 top-2 text-slate-400">%</span></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Organización</h3>
            <div className="space-y-1">
                <label className="text-sm font-medium">Marca</label>
                <select className="w-full h-10 rounded-md border px-3 text-sm" value={brandId} onChange={(e) => setBrandId(e.target.value)} required>
                  <option value="">Seleccionar</option>{brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-sm font-medium">Categoría</label>
                <select className="w-full h-10 rounded-md border px-3 text-sm" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                  <option value="">Seleccionar</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
          </div>
        </div>

      </div>
    </form>
  );
}
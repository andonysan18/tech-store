"use client"; // 👈 Esto es obligatorio para usar hooks de React

// 1. CORRECCIÓN: Usamos useActionState, importado de 'react'
import { useActionState } from "react"; 

import { createProduct, State } from "@/src/actions/product-actions";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

// Definimos las props que recibe este componente (los datos de la BD)
interface FormProps {
  categories: { id: number; name: string }[];
  brands: { id: number; name: string }[];
}

export function CreateProductForm({ categories, brands }: FormProps) {
  // Inicializamos el estado del formulario (sin errores al principio)
  const initialState: State = { message: null, errors: undefined }; // Usamos 'undefined' en lugar de {} para el tipo 'errors' que definimos en la Server Action
  
  // 🔥 CORRECCIÓN: El Hook mágico ahora es useActionState
  const [state, dispatch] = useActionState(createProduct, initialState);

  return (
    <form action={dispatch} className="space-y-4">
      
      {/* Nombre */}
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input name="name" id="name" placeholder="Ej: iPhone 15" />
        {/* Mostramos el primer error del array de errores de Zod */}
        {state.errors?.name && (
          <p className="text-red-500 text-sm">{state.errors.name[0]}</p> 
        )}
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea name="description" id="description" placeholder="Detalles técnicos..." />
      </div>

      {/* Precio y Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Precio ($)</Label>
          <Input name="price" id="price" type="number" step="0.01" placeholder="0.00" />
          {state.errors?.price && (
            <p className="text-red-500 text-sm">{state.errors.price[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input name="stock" id="stock" type="number" placeholder="0" />
          {state.errors?.stock && (
            <p className="text-red-500 text-sm">{state.errors.stock[0]}</p>
          )}
        </div>
      </div>

      {/* Selectores */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select name="categoryId">
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Mostramos el error de categoryId */}
          {state.errors?.categoryId && (
            <p className="text-red-500 text-sm">Selecciona una categoría</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Marca</Label>
          <Select name="brandId">
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Mostramos el error de brandId */}
          {state.errors?.brandId && (
            <p className="text-red-500 text-sm">Selecciona una marca</p>
          )}
        </div>
      </div>
      
      {/* Mensaje global de error (Base de datos o general) */}
      {state.message && (
        <p className="text-red-500 font-medium">{state.message}</p>
      )}

      <Button type="submit" className="w-full mt-4">
        Guardar Producto
      </Button>
    </form>
  );
}
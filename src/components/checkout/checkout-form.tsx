import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Truck } from "lucide-react";

interface CheckoutFormProps {
  formData: {
    name: string;
    lastname: string;
    phone: string;
    email: string;
  };
  onChange: (field: string, value: string) => void;
}

export function CheckoutForm({ formData, onChange }: CheckoutFormProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Truck className="text-blue-600" /> Tus Datos
      </h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input 
              id="name" 
              placeholder="Tu nombre" 
              // 🔥 Conectamos el valor y el evento
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastname">Apellido</Label>
            <Input 
              id="lastname" 
              placeholder="Apellido" 
              value={formData.lastname}
              onChange={(e) => onChange("lastname", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">WhatsApp / Teléfono</Label>
          <Input 
            id="phone" 
            type="tel" 
            placeholder="11 5555 6666" 
            value={formData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email (Opcional)</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="tu@email.com" 
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
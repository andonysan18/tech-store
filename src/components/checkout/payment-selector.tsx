import { Banknote, Store, CreditCard, Copy, MapPin } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { toast } from "sonner";

interface PaymentSelectorProps {
  selectedMethod: "transfer" | "cash";
  onMethodChange: (method: "transfer" | "cash") => void;
}

export function PaymentSelector({ selectedMethod, onMethodChange }: PaymentSelectorProps) {
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado al portapapeles");
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <CreditCard className="text-blue-600" /> Forma de Pago
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          onClick={() => onMethodChange("transfer")}
          className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${
            selectedMethod === "transfer"
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-slate-100 hover:border-slate-300"
          }`}
        >
          <Banknote size={32} />
          <span className="font-semibold text-sm text-center">Transferencia</span>
        </div>
        <div
          onClick={() => onMethodChange("cash")}
          className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${
            selectedMethod === "cash"
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-slate-100 hover:border-slate-300"
          }`}
        >
          <Store size={32} />
          <span className="font-semibold text-sm text-center">Efectivo en Local</span>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 animate-in fade-in zoom-in duration-300">
        {selectedMethod === "transfer" ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Datos Bancarios</h3>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                5% OFF
              </Badge>
            </div>
            <p className="text-sm text-slate-500">
              Envíanos el comprobante por WhatsApp al finalizar.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Retiro en Local</h3>
              <Badge variant="outline">Horario: 9 a 18hs</Badge>
            </div>
            <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-slate-200">
              <MapPin className="text-red-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-bold text-slate-800 text-sm">Av. Siempre Viva 742</p>
                <p className="text-xs text-slate-500">Springfield, Buenos Aires</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
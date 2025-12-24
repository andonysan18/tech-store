import { Truck, ShieldCheck, CreditCard, RotateCcw } from "lucide-react";

export function BenefitsBar() {
  return (
    <section className="bg-white border-y border-slate-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Item 1 */}
          <div className="flex items-center gap-4 justify-center md:justify-start group">
            <div className="bg-blue-50 p-3 rounded-full text-blue-600 group-hover:scale-110 transition duration-300">
                <Truck size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Envíos a todo el país</p>
              <p className="text-xs text-slate-500">Gratis desde $150.000</p>
            </div>
          </div>
          {/* Item 2 */}
          <div className="flex items-center gap-4 justify-center md:justify-start group">
            <div className="bg-green-50 p-3 rounded-full text-green-600 group-hover:scale-110 transition duration-300">
                <CreditCard size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Hasta 6 cuotas</p>
              <p className="text-xs text-slate-500">Sin interés con bancos</p>
            </div>
          </div>
          {/* Item 3 */}
          <div className="flex items-center gap-4 justify-center md:justify-start group">
            <div className="bg-purple-50 p-3 rounded-full text-purple-600 group-hover:scale-110 transition duration-300">
                <ShieldCheck size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Garantía Oficial</p>
              <p className="text-xs text-slate-500">En todos los productos</p>
            </div>
          </div>
          {/* Item 4 */}
          <div className="flex items-center gap-4 justify-center md:justify-start group">
            <div className="bg-orange-50 p-3 rounded-full text-orange-600 group-hover:scale-110 transition duration-300">
                <RotateCcw size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Devolución gratis</p>
              <p className="text-xs text-slate-500">Tenés 30 días</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
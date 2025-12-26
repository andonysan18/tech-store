import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subValue?: string; // Ej: "+12%" o "Activos"
  color?: "blue" | "green" | "purple" | "orange"; // Limitamos los colores
}

export function DashboardCard({ title, value, icon: Icon, subValue, color = "blue" }: DashboardCardProps) {
  
  // Diccionario de colores para mantener el código limpio
  const colors = {
    blue:   { bg: "bg-blue-100", text: "text-blue-600", badge: "bg-blue-100 text-blue-700" },
    green:  { bg: "bg-green-100", text: "text-green-600", badge: "bg-green-100 text-green-700" },
    purple: { bg: "bg-purple-100", text: "text-purple-600", badge: "bg-purple-100 text-purple-700" },
    orange: { bg: "bg-orange-100", text: "text-orange-600", badge: "bg-orange-100 text-orange-700" },
  };

  const theme = colors[color];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${theme.bg} ${theme.text}`}>
          <Icon size={24} />
        </div>
        {subValue && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${theme.badge}`}>
            {subValue}
          </span>
        )}
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
    </div>
  );
}
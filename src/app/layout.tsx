import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/src/lib/utils";
import { Footer } from "@/src/components/shared/footer"; // Ajusta ruta si es necesario
import { Navbar } from "@/src/components/shared/navbar"; // Ajusta ruta si es necesario
import { Toaster } from "sonner"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechStore - Tecnología Premium",
  description: "La mejor tienda de electrónica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        
        <Navbar />

        <main className="flex-1">
           {children}
        </main>

        <Footer />
        
        {/* Notificaciones Toast */}
        <Toaster richColors position="bottom-right" />
        
      </body>
    </html>
  );
}
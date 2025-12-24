import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 1. Verificamos credenciales
    if (
      username !== process.env.ADMIN_USER || 
      password !== process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    // 2. Creamos la cookie con la duración que quieras
    const cookieStore = await cookies();
    
    // 👇 AQUÍ ELIGES EL TIEMPO:
    // 1 Hora   = 60 * 60
    // 8 Horas  = 60 * 60 * 8 (Ideal para jornada laboral)
    // 1 Día    = 60 * 60 * 24
    // 1 Semana = 60 * 60 * 24 * 7
    
    const ONE_DAY = 60 * 60 * 24; 

    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: ONE_DAY, // 👈 Cámbialo por la variable que prefieras
      path: "/",
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json(
        { error: "Error interno" }, 
        { status: 500 }
    );
  }
}
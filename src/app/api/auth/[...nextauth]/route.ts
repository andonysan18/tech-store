import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/src/lib/db"; // Asegúrate de que esta ruta sea correcta

export const authOptions: NextAuthOptions = {
  // 👇 ESTO FALTABA: Es crucial para producción en Vercel
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "usuario@techstore.com" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        // 🎤 LOG 1: Ver qué datos llegan
        console.log("📨 [NextAuth] Intentando login con:", { 
            email: credentials?.email, 
            passwordLength: credentials?.password?.length 
        });

        if (!credentials?.email || !credentials?.password) {
            console.log("❌ [NextAuth] Falta email o contraseña");
            return null;
        }

        // 2. Buscar usuario en la DB
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // 🎤 LOG 2: Resultado de DB
        if (!user) {
            console.log("❌ [NextAuth] Usuario NO encontrado en la base de datos.");
            return null; 
        } else {
            console.log(`👤 [NextAuth] Usuario encontrado: ${user.email} | Rol: ${user.role}`);
        }

        // 3. Comparar contraseña
        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

        console.log("🔑 [NextAuth] Resultado de bcrypt:", passwordsMatch ? "✅ ÉXITO" : "❌ FALLÓ");

        if (!passwordsMatch) {
            return null; 
        }

        // 4. Retornar usuario limpio
        const { password: _, ...userWithoutPassword } = user;
        
        return {
            id: userWithoutPassword.id.toString(),
            name: userWithoutPassword.name,
            email: userWithoutPassword.email,
            role: userWithoutPassword.role, 
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }: any) {
      if (session && session.user) session.user.role = token.role;
      return session;
    }
  },
  pages: {
    signIn: "/admin/login", // Tu página personalizada
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
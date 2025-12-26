import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/src/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "usuario@techstore.com" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        // 🎤 LOG 1: Ver qué datos llegan del formulario
        console.log("📨 [NextAuth] Intentando login con:", { 
            email: credentials?.email, 
            passwordLength: credentials?.password?.length 
        });

        // 1. Verificar que lleguen datos
        if (!credentials?.email || !credentials?.password) {
            console.log("❌ [NextAuth] Falta email o contraseña");
            return null;
        }

        // 2. Buscar usuario en la DB
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // 🎤 LOG 2: Ver si la base de datos devolvió algo
        if (!user) {
            console.log("❌ [NextAuth] Usuario NO encontrado en la base de datos.");
            return null; 
        } else {
            console.log(`👤 [NextAuth] Usuario encontrado: ${user.email} | Rol: ${user.role}`);
            console.log(`🔒 [NextAuth] Hash en DB: ${user.password.substring(0, 10)}...`); // Vemos un pedacito del hash
        }

        // 3. Comparar contraseña (La que escribe el usuario vs. la encriptada en DB)
        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

        // 🎤 LOG 3: Ver si el match fue exitoso
        console.log("🔑 [NextAuth] Resultado de bcrypt.compare:", passwordsMatch ? "✅ ÉXITO" : "❌ FALLÓ");

        if (!passwordsMatch) {
            return null; // Contraseña incorrecta
        }

        // 4. Si todo está bien, retornamos el usuario (sin el password)
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
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session && session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin/login", 
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
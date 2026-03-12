import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      try {
        const { id, name, email, image } = user;
        if (!id || !email) return true;

        const { error } = await supabaseAdmin.from("profiles").upsert(
          {
            id,
            full_name: name ?? null,
            email,
            avatar_url: image ?? null,
          },
          { onConflict: "id" }
        );

        if (error) {
          console.error("Supabase profile upsert error in NextAuth signIn:", error);
        }
      } catch (err) {
        console.error("Unexpected error in NextAuth signIn callback:", err);
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


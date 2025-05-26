import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"


const cID = process.env.GOOGLE_CLIENT_ID! 
const cSecret = process.env.GOOGLE_CLIENT_SECRET!

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: cID,
      clientSecret: cSecret,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user }) {
      return token
    },
  },
}

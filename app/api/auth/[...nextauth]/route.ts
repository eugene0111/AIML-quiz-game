
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    // signIn: '/auth/signin', // We can add a custom page later
  },
  callbacks: {
    async session({ session, token }) {
        return session;
    }
  }
});

export { handler as GET, handler as POST };

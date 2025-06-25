// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import authOptions from "@/lib/authOptions"; // используй абсолютный путь, если можно

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

import NextAuth from "next-auth/next";
import { authOptions } from "./options";

//the below method has to be named as handler//
const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}
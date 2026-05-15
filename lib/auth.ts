import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/db";
import User from "@/Models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
               if(!credentials?.email || !credentials?.password) {
                throw new Error("Email and password are required");
            }
            try {
                await connectToDatabase();
                const user = await User.findOne({ email: credentials.email });
                if(!user){
                    throw new Error("No user found with this email");
                }
             const isMatch = await bcrypt.compare(credentials.password, user.password)
                if(!isMatch){
                    throw new Error("Incorrect password");
                }
                return {
                    id: user._id.toString(),
                    email: user.email
                }
            } catch (error) {
                throw new Error("Invalid email or password");
            }
            }
        })
    ],
    callbacks: {
        async jwt ({token, user}){
            if(user){
                token.id = user.id;
            }
            return token;
        },
        async session({session, token}){
            if(token.id){
                session.user.id = token.id as string;
            }
            
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 20 * 24 * 60 * 60, // 20 days
    }
    ,
    pages: {
        signIn: "/signIn",
        error: "/register"
    },
    secret: process.env.NEXTAUTH_SECRET
}
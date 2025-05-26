import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/config/db";
import User from "@/models/User";

export const authOptions = {
    providers:[
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
    ],
    callbacks:{
        async signIn({user}){
            try {
                await connectDB();
                const existingUser = await User.findOne({email: user.email});

                if(!existingUser)
                {
                    await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image, 
                    });
                    return true;
                }
            } catch (error) {
                console.log("Error saving user: ", error);
                return false;
            }
        },
        async redirect({url, baseUrl}){
            return "/dashboard"
        },
        async session({session}){
            return session;
        },
        pages:{
            signIn: "/login"
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
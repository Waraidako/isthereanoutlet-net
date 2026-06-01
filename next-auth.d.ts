import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface User extends DefaultUser {
        id: number;
        role: string;
    }

    interface Session {
        user: {
            id: number;
            role: string;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id: number;
        role: string;
    }
}

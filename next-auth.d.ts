import "next-auth";

declare module "next-auth" {
    interface User {
        role: string;
    }

    interface Session {
        user: {
            role: string;
        } & DefaultSession["user"];
        expires: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: string;
    }
}

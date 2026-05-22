import { NextAuthOptions } from 'next-auth/';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@/app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { Session } from 'next-auth';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type ExtendedSession = Session & {
    user: {
        role: string;
    }
};

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    pages: {
        signIn: '/auth/login',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                nickname: { label: 'Nickname', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.nickname || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { nickname: credentials.nickname }
                });

                if (!user || !user.pass_hash) return null;

                const isValid = await bcrypt.compare(credentials.password, user.pass_hash);

                if (!isValid) return null;

                return {
                    id: user.id.toString(),
                    name: user.nickname,
                    role: user.access_level
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user && 'role' in user) token.role = user.role as string;
            return token;
        },
        async session({ session, token }) {
            const extendedSession  = session as unknown as ExtendedSession;
            if (session.user) extendedSession.user.role = token.role;
            return extendedSession;
        }
    }
}
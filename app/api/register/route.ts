import { PrismaClient } from '@/app/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req: Request): Promise<Response> {
    try {
        const { nickname, password } = await req.json();

        const existingUser = await prisma.user.findUnique({
            where: { nickname }
        });

        if (existingUser) {
            return Response.json({
                status: 400,
                statusText: 'Bad Request',
                message: 'User already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                nickname: nickname,
                pass_hash: hashedPassword,
                access_level: 'user',
            }
        })

        return Response.json({
            status: 201,
            statusText: 'Created',
            user: { id: newUser.id, nickname: newUser.nickname }
        })
    } catch (error) {
        console.log('Registration error', error);
        return Response.json({
            status: 500,
            statusText: 'Internal Server Error',
        })
    }
}
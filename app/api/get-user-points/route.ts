import { PrismaClient } from '@/app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(req: Request): Promise<Response> {
    console.log(req.url);
    console.log(decodeURIComponent(req.url));

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    if (!userId) return Response.json({ status: 400, error: 'Missing user ID' });

    console.log(userId);
    const res = await prisma.point.findMany({
        where: {
            userId: parseInt(userId),
        },
    });
    res.sort((a, b) => a.id - b.id);
    console.log(res);
    return Response.json({ status: 200, statusText: 'OK', points: res });
}
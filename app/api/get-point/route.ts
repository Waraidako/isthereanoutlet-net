import { PrismaClient } from '@/app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(req: Request): Promise<Response> {
    const coords = decodeURIComponent(req.url.split('=')[1]);
    const res = await prisma.point.findUnique({
        where: {
            coordinates: coords,
        },
    });
    console.log(res);
    return Response.json({ status: 200, statusText: 'OK', point: res });
}
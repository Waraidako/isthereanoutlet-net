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
    // const coords = decodeURIComponent(req.url.split('=')[1]);

    const { searchParams } = new URL(req.url);
    const coords = searchParams.get('coordinates');

    if (!coords) return Response.json({ status: 400, error: 'Missing coordinates' });

    console.log(coords);
    const res = await prisma.point.findFirst({
        where: {
            coordinates: coords,
        },
    });
    console.log(res);
    return Response.json({ status: 200, statusText: 'OK', point: res });
}
import { PrismaClient } from '@/app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';
import path from 'path';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req: Request): Promise<Response> {
    const pointData = await req.json();
    let photoPath: string = pointData.photo ? path.join('images', 'points', pointData.photo) : '';

    const res = await prisma.point.upsert({
        where: { coordinates: pointData.coordinates },
        update: {},
        create: {
            name: pointData.name,
            description: pointData.description,
            photo: photoPath,
            type: pointData.type ? pointData.type : 'has-outlets',
            coordinates: pointData.coordinates,
            is_confirmed: pointData.is_confirmed ? pointData.is_confirmed : false,
            is_deleted: false,
            last_edited: new Date(),
            userId: pointData.userId ? pointData.userId : 3,
        }
    })
    return Response.json({status: 200, statusText: 'OK', data: res});
}
import { PrismaClient } from '@/app/generated/prisma';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

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
            userId: pointData.userId ? pointData.userId : 1,
        }
    })
    return Response.json({status: 200, statusText: 'OK', data: res});
}
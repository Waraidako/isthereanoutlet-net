import { PrismaClient } from '@/app/generated/prisma'

const prisma = new PrismaClient();

export async function POST(req: Request): Promise<Response> {
    const pointData = await req.json();
    const res = await prisma.point.create({
        data: {
            name: pointData.name,
            description: pointData.description,
            photo: pointData.photo ? pointData.photo : '',
            type: pointData.type,
            coordinates: pointData.coordinates,
            is_confirmed: pointData.is_confirmed,
            is_deleted: false,
            userId: pointData.userId,
        }
    })
    return Response.json({status: 200, statusText: 'OK'});
}
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

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
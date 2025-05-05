import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET(): Promise<Response> {
    const res = await prisma.point.findMany();
    return Response.json({ status: 200, statusText: 'OK', points: res });
}
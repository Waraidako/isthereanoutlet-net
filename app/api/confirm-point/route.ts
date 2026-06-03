import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/app/lib/auth";
import { PrismaClient } from '@/app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';
// @ts-ignore
import { Session } from "next-auth/react";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function PUT(
    req: Request,
): Promise<Response> {
    const { searchParams } = new URL(req.url);
    const pointId = searchParams.get('id');

    if (!pointId) return Response.json({}, { status: 400, statusText: 'Point ID not provided' });

    const session = await getServerSession(authOptions);
    type ExtendedSession = Session & {
        user: {
            id: number;
            role: string;
        }
    };
    const extendedSession = session as unknown as ExtendedSession;

    if (!extendedSession?.user) {
        return Response.json({}, { status: 401, statusText: 'Unauthorized' });
    }

    const point = await prisma.point.findUnique({
        where: {
            id: parseInt(pointId, 10)
        }
    })

    if (!point) return Response.json({}, { status: 404, statusText: 'Not Found' });

    if (point.userId === extendedSession.user.id || (point.userId === extendedSession.user.id && extendedSession.user.role !== 'admin')) {
        return Response.json({}, { status: 403, statusText: 'Forbidden' });
    }

    const result = await prisma.point.updateMany({
        where: {
            id: parseInt(pointId, 10),
        },
        data: {
            is_confirmed: true,
        }
    })

    return Response.json({}, { status: 200, statusText: 'OK' });
}
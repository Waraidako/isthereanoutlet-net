import { PrismaClient } from '@/app/generated/prisma';
import {FormDataEntryValue} from "undici-types";

const prisma = new PrismaClient();

export async function POST(req: Request): Promise<Response> {
    const pointData = await req.json();

    const photo: string[] = pointData.photo ? pointData.photo.split('.') : [""];
    const photoExtension: string = photo[photo.length - 1];
    const allowedExtensions: string[] = ["png", "jpg", "jpeg", "gif"];
    if (photoExtension in allowedExtensions) {
        Я^^
    }

    const res = await prisma.point.upsert({
        where: { coordinates: pointData.coordinates },
        update: {},
        create: {
            name: pointData.name,
            description: pointData.description,
            photo: pointData.photo ? pointData.photo : '',
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
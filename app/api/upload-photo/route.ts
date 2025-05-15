import path from 'path';
import fs from "fs";

export async function POST(req: Request): Promise<Response> {
    const fileBuffer = await req.arrayBuffer();
    if (!req.headers.get('x-filename')) return Response.json({ status: 400, statusText: "Bad Request" });
    const filename: string = req.headers.get('x-filename')!;
    const uploadPath = path.join(process.cwd(), 'public', 'images', 'points', filename)

    try {
        fs.writeFileSync(uploadPath, Buffer.from(fileBuffer));
        return Response.json({ status: 200, statusText: 'OK' });
    } catch (err) {
        return Response.json({ status: 500, statusText: 'Internal Server Error' });
    }
}
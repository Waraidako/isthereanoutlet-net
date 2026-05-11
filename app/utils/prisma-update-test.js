import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config'; // Make sure env vars are actually loaded

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const updatedPoint = await prisma.point.update({
        where: { id: 1 },
        data: { description: 'cool ass point updated' }
    });
    console.log("New Timestamp:", updatedPoint.last_edited);
}

main();

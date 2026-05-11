import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function setPasswords() {
    const DEFAULT_PLAIN_PASSWORD = "hellofriend";
    const hashedDefault = await bcrypt.hash(DEFAULT_PLAIN_PASSWORD, 10);

    console.log("Searching for users without passwords...");

    // Find users where pass_hash is an empty string
    const usersToUpdate = await prisma.user.findMany({
        where: { pass_hash: "" }
    });

    console.log(`Found ${usersToUpdate.length} users. Updating...`);

    // Update them all to the same hashed default password
    const result = await prisma.user.updateMany({
        where: {
            id: { in: usersToUpdate.map(u => u.id) }
        },
        data: {
            pass_hash: hashedDefault
        }
    });

    console.log(`Successfully updated ${result.count} users.`);
    console.log(`Temporary password set to: ${DEFAULT_PLAIN_PASSWORD}`);

    await pool.end();
}

setPasswords().catch(err => {
    console.error(err);
    process.exit(1);
});

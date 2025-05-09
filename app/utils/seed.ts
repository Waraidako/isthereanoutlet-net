import { PrismaClient } from '@/app/generated/prisma/client';

const prisma = new PrismaClient();

async function seed() {
    const adminUser = await prisma.user.upsert({
        where: { nickname: 'waraidako' },
        update: {},
        create: {
            nickname: 'waraidako',
            access_level: 'admin',
            account_status: 'active',
            points_added: {
                create: [
                    {
                        name: 'place #1',
                        type: 'has-outlets',
                        is_confirmed: true,
                        coordinates: "[55.751934, 37.618346]",
                        description: "cool ass point",
                        photo: "images/test.jpg",
                    },
                    {
                        name: 'place #2',
                        type: 'no-outlets',
                        is_confirmed: true,
                        coordinates: "[55.752934, 37.619346]",
                        description: 'cool ass point #2'
                    }
                ]
            }
        }
    });
    const modUser = await prisma.user.upsert({
        where: { nickname: 'kvadrokpoptel' },
        update: {},
        create: {
            nickname: 'kvadrokpoptel',
            access_level: 'mod',
            account_status: 'active',
            points_added: {
                create: [
                    {
                        name: 'place #3',
                        type: 'has-outlets',
                        is_confirmed: false,
                        coordinates: '[55.752834, 37.618446]',
                        description: 'cool ahh place daym #3'
                    }
                ]
            }
        }
    });
    const regularUser = await prisma.user.upsert({
        where: { nickname: 'SASUr04ek' },
        update: {},
        create: {
            nickname: 'SASUr04ek',
            access_level: 'user',
            points_added: {
                create: [
                    {
                        name: 'place #4',
                        type: 'no-outlets',
                        is_confirmed: false,
                        coordinates: '[55.753934, 37.618556]',
                        description: 'cool ahh place daym #4'
                    }
                ]
            }
        }
    })
    console.log('seeded the db');
}
seed()
    .then(async () => {
        await prisma.$disconnect();
    }).catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
})
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

async function main() {
    console.log('Testing Prisma Connection...');
    try {
        const prisma = new PrismaClient();
        await prisma.$connect();
        console.log('Successfully connected to database!');
        const users = await prisma.usuario.count();
        console.log(`Found ${users} users.`);
        await prisma.$disconnect();
    } catch (e) {
        console.error('Connection failed:', e);
    }
}

main();

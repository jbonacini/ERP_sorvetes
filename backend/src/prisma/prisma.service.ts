import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.connectWithRetry();
    }

    private async connectWithRetry(retries = 30, delay = 5000) {
        for (let i = 0; i < retries; i++) {
            try {
                await this.$connect();
                console.log('Successfully connected to database');
                return;
            } catch (error) {
                console.error(`Error connecting to database (attempt ${i + 1}/${retries}):`, error.message);
                if (i === retries - 1) throw error;
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }
}

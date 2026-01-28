
import { Module } from '@nestjs/common';
import { TransportadorasService } from './transportadoras.service';
import { TransportadorasController } from './transportadoras.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [TransportadorasController],
    providers: [TransportadorasService],
})
export class TransportadorasModule { }

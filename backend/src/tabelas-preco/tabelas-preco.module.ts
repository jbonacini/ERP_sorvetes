import { Module } from '@nestjs/common';
import { TabelasPrecoService } from './tabelas-preco.service';
import { TabelasPrecoController } from './tabelas-preco.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [TabelasPrecoController],
    providers: [TabelasPrecoService],
})
export class TabelasPrecoModule { }

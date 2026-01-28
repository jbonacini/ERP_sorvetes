
import { Module } from '@nestjs/common';
import { FuncoesComerciaisService } from './funcoes-comerciais.service';
import { FuncoesComerciaisController } from './funcoes-comerciais.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [FuncoesComerciaisController],
    providers: [FuncoesComerciaisService],
})
export class FuncoesComerciaisModule { }

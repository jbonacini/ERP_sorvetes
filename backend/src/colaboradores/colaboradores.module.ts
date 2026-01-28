import { Module } from '@nestjs/common';
import { ColaboradoresService } from './colaboradores.service';
import { ColaboradoresController } from './colaboradores.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ColaboradoresController],
  providers: [ColaboradoresService],
})
export class ColaboradoresModule { }

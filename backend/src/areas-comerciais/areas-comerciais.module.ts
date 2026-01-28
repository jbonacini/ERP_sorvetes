import { Module } from '@nestjs/common';
import { AreasComerciaisService } from './areas-comerciais.service';
import { AreasComerciaisController } from './areas-comerciais.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AreasComerciaisController],
  providers: [AreasComerciaisService],
})
export class AreasComerciaisModule { }

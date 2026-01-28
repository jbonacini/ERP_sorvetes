import { Injectable } from '@nestjs/common';
import { CreateAreasComerciaiDto } from './dto/create-areas-comerciai.dto';
import { UpdateAreasComerciaiDto } from './dto/update-areas-comerciai.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AreasComerciaisService {
  constructor(private prisma: PrismaService) { }

  create(createAreasComerciaiDto: CreateAreasComerciaiDto) {
    return this.prisma.areaComercial.create({
      data: createAreasComerciaiDto as any,
    });
  }

  findAll() {
    return this.prisma.areaComercial.findMany();
  }

  findOne(id: string) {
    return this.prisma.areaComercial.findUnique({
      where: { id },
      include: { clientes: true }
    });
  }

  update(id: string, updateAreasComerciaiDto: UpdateAreasComerciaiDto) {
    return this.prisma.areaComercial.update({
      where: { id },
      data: updateAreasComerciaiDto as any,
    });
  }

  remove(id: string) {
    return this.prisma.areaComercial.delete({
      where: { id },
    });
  }
}

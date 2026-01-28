import { Injectable } from '@nestjs/common';
import { CreatePerfiDto } from './dto/create-perfi.dto';
import { UpdatePerfiDto } from './dto/update-perfi.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PerfisService {
  constructor(private prisma: PrismaService) { }

  create(createPerfiDto: CreatePerfiDto) {
    return this.prisma.perfil.create({
      data: createPerfiDto,
    });
  }

  findAll() {
    return this.prisma.perfil.findMany();
  }

  findOne(id: string) {
    return this.prisma.perfil.findUnique({
      where: { id },
    });
  }

  update(id: string, updatePerfiDto: UpdatePerfiDto) {
    return this.prisma.perfil.update({
      where: { id },
      data: updatePerfiDto,
    });
  }

  remove(id: string) {
    return this.prisma.perfil.delete({
      where: { id },
    });
  }
}

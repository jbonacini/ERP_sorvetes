import { Injectable } from '@nestjs/common';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TurnosService {
  constructor(private prisma: PrismaService) { }

  create(createTurnoDto: CreateTurnoDto) {
    return this.prisma.turno.create({
      data: createTurnoDto as any,
    });
  }

  findAll() {
    return this.prisma.turno.findMany();
  }

  findOne(id: string) {
    return this.prisma.turno.findUnique({
      where: { id },
      include: { colaboradores: true }
    });
  }

  update(id: string, updateTurnoDto: UpdateTurnoDto) {
    return this.prisma.turno.update({
      where: { id },
      data: updateTurnoDto as any,
    });
  }

  remove(id: string) {
    return this.prisma.turno.delete({
      where: { id },
    });
  }
}

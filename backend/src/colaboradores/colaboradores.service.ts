import { Injectable } from '@nestjs/common';
import { CreateColaboradorDto } from './dto/create-colaborador.dto';
import { UpdateColaboradorDto } from './dto/update-colaborador.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ColaboradoresService {
  constructor(private prisma: PrismaService) { }

  create(createDto: CreateColaboradorDto) {
    const { dependentes, ...data } = createDto;
    return this.prisma.colaborador.create({
      data: {
        ...data,
        dependentes: dependentes ? {
          create: dependentes
        } : undefined
      },
    });
  }

  findAll() {
    return this.prisma.colaborador.findMany({
      include: { usuario: true, turno: true, dependentes: true }
    });
  }

  findOne(id: string) {
    return this.prisma.colaborador.findUnique({
      where: { id },
      include: { usuario: true, turno: true, dependentes: true }
    });
  }

  update(id: string, updateDto: UpdateColaboradorDto) {
    const { dependentes, ...data } = updateDto;
    // Omitindo dependentes no update por enquanto para simplificar
    return this.prisma.colaborador.update({
      where: { id },
      data: data as any,
    });
  }

  remove(id: string) {
    return this.prisma.colaborador.delete({
      where: { id },
    });
  }
}

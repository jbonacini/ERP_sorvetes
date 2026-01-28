import { Injectable } from '@nestjs/common';
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TarefasService {
  constructor(private prisma: PrismaService) { }

  create(createTarefaDto: CreateTarefaDto) {
    return this.prisma.tarefaOperacional.create({
      data: createTarefaDto as any,
    });
  }

  findAll() {
    return this.prisma.tarefaOperacional.findMany({
      include: { colaborador: true, turno: true }
    });
  }

  findOne(id: string) {
    return this.prisma.tarefaOperacional.findUnique({
      where: { id },
      include: { colaborador: true, turno: true }
    });
  }

  update(id: string, updateTarefaDto: UpdateTarefaDto) {
    return this.prisma.tarefaOperacional.update({
      where: { id },
      data: updateTarefaDto as any,
    });
  }

  remove(id: string) {
    return this.prisma.tarefaOperacional.delete({
      where: { id },
    });
  }
}

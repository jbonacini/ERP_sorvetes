import { Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) { }

  create(createClienteDto: CreateClienteDto) {
    const { condicaoPagamentoId, ...data } = createClienteDto;

    return this.prisma.cliente.create({
      data: {
        ...data,
        condicoesPagamento: condicaoPagamentoId ? {
          connect: [{ id: condicaoPagamentoId }]
        } : undefined
      } as any,
    });
  }

  findAll() {
    return this.prisma.cliente.findMany({
      include: { areaComercial: true }
    });
  }

  findOne(id: string) {
    return this.prisma.cliente.findUnique({
      where: { id },
      include: { areaComercial: true, ordensServico: true }
    });
  }

  update(id: string, updateClienteDto: UpdateClienteDto) {
    return this.prisma.cliente.update({
      where: { id },
      data: updateClienteDto as any,
    });
  }

  remove(id: string) {
    return this.prisma.cliente.delete({
      where: { id },
    });
  }
}

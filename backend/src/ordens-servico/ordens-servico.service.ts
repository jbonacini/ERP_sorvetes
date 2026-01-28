import { Injectable } from '@nestjs/common';
import { CreateOrdensServicoDto } from './dto/create-ordens-servico.dto';
import { UpdateOrdensServicoDto } from './dto/update-ordens-servico.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdensServicoService {
  constructor(private prisma: PrismaService) { }

  async create(createOrdensServicoDto: CreateOrdensServicoDto) {
    // Generate next number manually or let DB handle if autoincrement was supported (SQLite limitation handled by schema change or logic)
    // For simplicity in this step, we assume the user provides it or we calculate it. 
    // Ideally we'd find max and increment, but for MVP let's trust the input or simple logic.
    // Let's implement a simple max+1 logic for 'numero' if not provided?
    // Actually, let's just save. The schema change removed autoincrement.
    // We should probably auto-generate 'numero'.

    let numero = createOrdensServicoDto.numero;
    if (!numero) {
      const lastOS = await this.prisma.ordemServico.findFirst({
        orderBy: { numero: 'desc' }
      });
      numero = (lastOS?.numero || 0) + 1;
    }

    return this.prisma.ordemServico.create({
      data: {
        ...createOrdensServicoDto,
        numero,
      } as any,
    });
  }

  findAll() {
    return this.prisma.ordemServico.findMany({
      include: { cliente: true, colaborador: true }
    });
  }

  findOne(id: string) {
    return this.prisma.ordemServico.findUnique({
      where: { id },
      include: { cliente: true, colaborador: true }
    });
  }

  update(id: string, updateOrdensServicoDto: UpdateOrdensServicoDto) {
    return this.prisma.ordemServico.update({
      where: { id },
      data: updateOrdensServicoDto as any,
    });
  }

  remove(id: string) {
    return this.prisma.ordemServico.delete({
      where: { id },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCondicaoPagamentoDto } from './dto/create-condicao-pagamento.dto';
import { UpdateCondicaoPagamentoDto } from './dto/update-condicao-pagamento.dto';

@Injectable()
export class CondicoesPagamentoService {
    constructor(private prisma: PrismaService) { }

    create(createDto: CreateCondicaoPagamentoDto) {
        return this.prisma.condicaoPagamento.create({
            data: createDto,
        });
    }

    findAll(empresaId: string) {
        return this.prisma.condicaoPagamento.findMany({
            where: { empresaId },
        });
    }

    findOne(id: string) {
        return this.prisma.condicaoPagamento.findUnique({
            where: { id },
        });
    }

    update(id: string, updateDto: UpdateCondicaoPagamentoDto) {
        return this.prisma.condicaoPagamento.update({
            where: { id },
            data: updateDto,
        });
    }

    remove(id: string) {
        return this.prisma.condicaoPagamento.delete({
            where: { id },
        });
    }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGrupoTabelaDto } from './dto/create-grupo-tabela.dto';
import { UpdateGrupoTabelaDto } from './dto/update-grupo-tabela.dto';
import { CreateTabelaPrecoDto } from './dto/create-tabela-preco.dto';
import { UpdateTabelaPrecoDto } from './dto/update-tabela-preco.dto';

@Injectable()
export class TabelasPrecoService {
    constructor(private prisma: PrismaService) { }

    // ================= GRUPOS =================
    createGrupo(createDto: CreateGrupoTabelaDto) {
        return this.prisma.grupoTabelaPreco.create({
            data: createDto,
        });
    }

    findAllGrupos(empresaId: string) {
        return this.prisma.grupoTabelaPreco.findMany({
            where: { empresaId },
            include: { tabelas: true },
        });
    }

    findOneGrupo(id: string) {
        return this.prisma.grupoTabelaPreco.findUnique({
            where: { id },
            include: { tabelas: true },
        });
    }

    updateGrupo(id: string, updateDto: UpdateGrupoTabelaDto) {
        return this.prisma.grupoTabelaPreco.update({
            where: { id },
            data: updateDto,
        });
    }

    removeGrupo(id: string) {
        return this.prisma.grupoTabelaPreco.delete({
            where: { id },
        });
    }

    // ================= TABELAS =================
    createTabela(createDto: CreateTabelaPrecoDto) {
        return this.prisma.tabelaPreco.create({
            data: createDto,
        });
    }

    findAllTabelas(grupoId: string) {
        return this.prisma.tabelaPreco.findMany({
            where: { grupoId },
            include: { itens: true },
        });
    }

    findOneTabela(id: string) {
        return this.prisma.tabelaPreco.findUnique({
            where: { id },
            include: { itens: { include: { produto: true } } },
        });
    }

    updateTabela(id: string, updateDto: UpdateTabelaPrecoDto) {
        return this.prisma.tabelaPreco.update({
            where: { id },
            data: updateDto,
        });
    }

    removeTabela(id: string) {
        return this.prisma.tabelaPreco.delete({
            where: { id },
        });
    }

    // ================= ITENS (Simplificado) =================
    async upsertItem(tabelaId: string, produtoId: string, precoVenda: number) {
        // Check if item exists, if so update, else create
        // Prisma doesn't support composite Id easily without @@id, here we use findFirst
        const existing = await this.prisma.itemTabelaPreco.findFirst({
            where: { tabelaId, produtoId },
        });

        if (existing) {
            return this.prisma.itemTabelaPreco.update({
                where: { id: existing.id },
                data: { precoVenda },
            });
        } else {
            return this.prisma.itemTabelaPreco.create({
                data: {
                    tabelaId,
                    produtoId,
                    precoVenda,
                },
            });
        }
    }
}

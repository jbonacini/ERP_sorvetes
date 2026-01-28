import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutosService {
    constructor(private prisma: PrismaService) { }

    create(createProdutoDto: CreateProdutoDto) {
        return this.prisma.produto.create({
            data: createProdutoDto,
        });
    }

    findAll(empresaId: string) {
        return this.prisma.produto.findMany({
            where: { empresaId },
            include: { categoria: true },
        });
    }

    findOne(id: string) {
        return this.prisma.produto.findUnique({
            where: { id },
            include: { categoria: true, movimentacoes: true },
        });
    }

    update(id: string, updateProdutoDto: UpdateProdutoDto) {
        return this.prisma.produto.update({
            where: { id },
            data: updateProdutoDto,
        });
    }

    remove(id: string) {
        return this.prisma.produto.delete({
            where: { id },
        });
    }
}

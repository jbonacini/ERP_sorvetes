
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidosService {
    constructor(private prisma: PrismaService) { }

    async create(createPedidoDto: CreatePedidoDto) {
        const { itens, ...pedidoData } = createPedidoDto;

        // Calcular totais
        let valorSubtotal = 0;
        let valorDescontoTotal = 0;

        const itensComTotal = itens.map(item => {
            const totalItem = (item.precoUnitario * item.quantidade) - (item.desconto || 0);
            valorSubtotal += (item.precoUnitario * item.quantidade);
            valorDescontoTotal += (item.desconto || 0);
            return {
                ...item,
                valorTotal: totalItem
            };
        });

        const valorTotal = valorSubtotal - valorDescontoTotal;

        // Gerar numero do pedido (simples increment ou timestamp por enquanto)
        const count = await this.prisma.pedidoVenda.count({
            where: { empresaId: createPedidoDto.empresaId }
        });
        const numero = count + 1;

        return this.prisma.pedidoVenda.create({
            data: {
                ...pedidoData,
                numero,
                valorSubtotal,
                valorDesconto: valorDescontoTotal,
                valorTotal,
                itens: {
                    create: itensComTotal
                }
            },
            include: {
                itens: {
                    include: { produto: true }
                },
                cliente: true
            }
        });
    }

    findAll(empresaId: string) {
        return this.prisma.pedidoVenda.findMany({
            where: { empresaId },
            include: {
                cliente: true,
                itens: true,
                // vendedorId is scalar, already selected
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    findOne(id: string) {
        return this.prisma.pedidoVenda.findUnique({
            where: { id },
            include: {
                cliente: true,
                itens: {
                    include: { produto: true }
                }
            }
        });
    }

    async update(id: string, updatePedidoDto: UpdatePedidoDto) {
        // Nota: Atualizar itens é complexo, por simplicidade aqui atualizaremos apenas dados do cabeçalho
        // Para atualizar itens, o ideal é deletar e recriar ou logica de diff
        const { itens, ...pedidoData } = updatePedidoDto;

        return this.prisma.pedidoVenda.update({
            where: { id },
            data: pedidoData,
        });
    }

    remove(id: string) {
        return this.prisma.pedidoVenda.delete({
            where: { id },
        });
    }
}

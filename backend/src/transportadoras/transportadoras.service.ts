
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransportadoraDto } from './dto/create-transportadora.dto';
import { UpdateTransportadoraDto } from './dto/update-transportadora.dto';

@Injectable()
export class TransportadorasService {
    constructor(private prisma: PrismaService) { }

    create(createDto: CreateTransportadoraDto) {
        return this.prisma.transportadora.create({
            data: createDto,
        });
    }

    findAll(empresaId: string) {
        return this.prisma.transportadora.findMany({
            where: { empresaId },
            include: { veiculos: true }
        });
    }

    findOne(id: string) {
        return this.prisma.transportadora.findUnique({
            where: { id },
            include: { veiculos: true }
        });
    }

    update(id: string, updateDto: UpdateTransportadoraDto) {
        return this.prisma.transportadora.update({
            where: { id },
            data: updateDto,
        });
    }

    remove(id: string) {
        return this.prisma.transportadora.delete({
            where: { id },
        });
    }
}

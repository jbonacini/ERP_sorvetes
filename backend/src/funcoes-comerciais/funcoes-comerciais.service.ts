
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFuncaoComercialDto } from './dto/create-funcao-comercial.dto';
import { UpdateFuncaoComercialDto } from './dto/update-funcao-comercial.dto';

@Injectable()
export class FuncoesComerciaisService {
    constructor(private prisma: PrismaService) { }

    create(createDto: CreateFuncaoComercialDto) {
        return this.prisma.funcaoComercial.create({
            data: createDto,
        });
    }

    findAll(empresaId: string) {
        return this.prisma.funcaoComercial.findMany({
            where: { empresaId },
            include: {
                superior: true,
                subordinados: true,
            },
        });
    }

    findOne(id: string) {
        return this.prisma.funcaoComercial.findUnique({
            where: { id },
            include: {
                superior: true,
                subordinados: true,
            },
        });
    }

    update(id: string, updateDto: UpdateFuncaoComercialDto) {
        return this.prisma.funcaoComercial.update({
            where: { id },
            data: updateDto,
        });
    }

    remove(id: string) {
        return this.prisma.funcaoComercial.delete({
            where: { id },
        });
    }
}

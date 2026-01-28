import { Injectable } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmpresasService {
  constructor(private prisma: PrismaService) { }

  create(createEmpresaDto: CreateEmpresaDto) {
    const { endereco, ...empresaData } = createEmpresaDto;
    return this.prisma.empresa.create({
      data: {
        ...empresaData,
        endereco: endereco ? {
          create: endereco
        } : undefined
      },
      include: {
        endereco: true
      }
    });
  }

  findAll() {
    return this.prisma.empresa.findMany({
      include: {
        endereco: true
      }
    });
  }

  findOne(id: string) {
    return this.prisma.empresa.findUnique({
      where: { id },
      include: {
        endereco: true
      }
    });
  }

  update(id: string, updateEmpresaDto: UpdateEmpresaDto) {
    const { endereco, ...empresaData } = updateEmpresaDto as any; // Cast needed as UpdateDto is Partial
    // Simplification: Not handling nested update logic perfectly right now for Update
    // Just updating main fields
    return this.prisma.empresa.update({
      where: { id },
      data: empresaData,
    });
  }

  remove(id: string) {
    return this.prisma.empresa.delete({
      where: { id },
    });
  }
}

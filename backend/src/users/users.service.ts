import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const { email, nome, senha, perfilId, cargo, empresaId } = createUserDto as any; // Cast for now

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(senha, salt);

    return this.prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        perfilId,
        cargo,
        empresaId
      }
    });
  }

  findAll() {
    return this.prisma.usuario.findMany();
  }

  findOne(id: string) {
    return this.prisma.usuario.findUnique({ where: { id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.usuario.update({
      where: { id },
      data: updateUserDto as any,
    });
  }

  remove(id: string) {
    return this.prisma.usuario.delete({ where: { id } });
  }
}

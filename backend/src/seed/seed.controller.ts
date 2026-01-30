
import { Controller, Post, Get, Res, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Controller('seed-production')
export class SeedController {
    constructor(private readonly prisma: PrismaService) { }

    @Get()
    async seed(@Res() res: Response) {
        try {
            // 1. Criar Empresa se não existir
            let empresa = await this.prisma.empresa.findFirst({
                where: { cnpj: '12345678000199' },
            });

            if (!empresa) {
                empresa = await this.prisma.empresa.create({
                    data: {
                        razaoSocial: 'Sorveteria Exemplo Ltda',
                        nomeFantasia: 'Sorvetes Quentes',
                        cnpj: '12345678000199',
                        inscricaoEstadual: '123456789',
                        email: 'contato@exemplosorvete.com.br',
                        telefone: '11999999999',
                    },
                });
            }

            // 2. Criar Perfil Admin
            let perfil = await this.prisma.perfil.findFirst({
                where: { nome: 'Administrador' }
            });

            if (!perfil) {
                perfil = await this.prisma.perfil.create({
                    data: {
                        nome: 'Administrador',
                        permissoes: JSON.stringify({ todas: true }),
                        status: 'ATIVO',
                        descricao: 'Acesso total ao sistema'
                    }
                });
            }

            // 3. Criar Usuário Admin
            const existingUser = await this.prisma.usuario.findUnique({
                where: { email: 'admin@sorvete.com' },
            });

            if (!existingUser) {
                const senhaHash = await bcrypt.hash('123456', 10);
                await this.prisma.usuario.create({
                    data: {
                        nome: 'Admin',
                        email: 'admin@sorvete.com',
                        senha: senhaHash,
                        cargo: 'Administrador',
                        perfilId: perfil.id,
                        empresaId: empresa.id,
                        status: 'ATIVO',
                    },
                });
                return res.status(HttpStatus.CREATED).json({ message: 'Seed executado! Usuário Admin criado.' });
            }

            return res.status(HttpStatus.OK).json({ message: 'Seed já foi executado. Usuário Admin já existe.' });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}

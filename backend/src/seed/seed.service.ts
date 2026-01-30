
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
    private readonly logger = new Logger(SeedService.name);

    constructor(private readonly prisma: PrismaService) { }

    async onModuleInit() {
        this.logger.log('Iniciando verificação de Seed Automático (com Retry)...');
        this.executeSeedWithRetry();
    }

    async executeSeedWithRetry(retries = 20, delayMs = 5000) {
        for (let i = 0; i < retries; i++) {
            try {
                await this.seed();
                return; // Sucesso
            } catch (error) {
                this.logger.warn(`Tentativa de Seed ${i + 1}/${retries} falhou. Banco inacessível? Erro: ${error.message}`);
                if (i < retries - 1) {
                    await new Promise((resolve) => setTimeout(resolve, delayMs));
                }
            }
        }
        this.logger.error('Falha crítica: Não foi possível executar o Seed após várias tentativas.');
    }

    async seed() {
        // 1. Criar Empresa se não existir
        let empresa = await this.prisma.empresa.findFirst({
            where: { cnpj: '12345678000199' },
        });

        if (!empresa) {
            this.logger.log('Criando empresa padrão...');
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
            where: { nome: 'Administrador' },
        });

        if (!perfil) {
            this.logger.log('Criando perfil Administrador...');
            perfil = await this.prisma.perfil.create({
                data: {
                    nome: 'Administrador',
                    permissoes: JSON.stringify({ todas: true }),
                    status: 'ATIVO',
                    descricao: 'Acesso total ao sistema',
                },
            });
        }

        // 3. Criar Usuário Admin
        const existingUser = await this.prisma.usuario.findUnique({
            where: { email: 'admin@sorvete.com' },
        });

        if (!existingUser) {
            this.logger.log('Criando usuário Admin...');
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
            this.logger.log('Seed executado com sucesso! Usuário Admin criado.');
        } else {
            this.logger.log('Usuário Admin já existe. Seed concluído.');
        }
    }
}

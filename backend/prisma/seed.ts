
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Limpar banco
    try {
        await prisma.movimentacaoEstoque.deleteMany();
        await prisma.itemPedidoVenda.deleteMany();
        await prisma.pedidoVenda.deleteMany();
        await prisma.ordemServico.deleteMany();
        await prisma.cliente.deleteMany();
        await prisma.usuario.deleteMany();
        await prisma.perfil.deleteMany();
        await prisma.colaborador.deleteMany();
        await prisma.turno.deleteMany();
        await prisma.areaComercial.deleteMany();
        await prisma.condicaoPagamento.deleteMany();
        await prisma.tabelaPreco.deleteMany();
        await prisma.grupoTabelaPreco.deleteMany();
        await prisma.empresa.deleteMany();
    } catch (e) {
        console.log("Banco já limpo ou erro ao limpar:", e);
    }

    const empresa = await prisma.empresa.create({
        data: {
            razaoSocial: 'Sorveteria Exemplo Ltda',
            nomeFantasia: 'Sorvetes Quentes',
            cnpj: '12345678000199',
            inscricaoEstadual: '123456789',
            email: 'contato@exemplosorvete.com.br',
            telefone: '11999999999'
        },
    });

    const perfil = await prisma.perfil.create({
        data: {
            nome: 'Administrador',
            permissoes: JSON.stringify({ todas: true }),
            status: 'ATIVO',
            descricao: 'Acesso total ao sistema'
        }
    });

    const senhaHash = await bcrypt.hash('123456', 10);

    const usuario = await prisma.usuario.create({
        data: {
            nome: 'Admin',
            email: 'admin@sorvete.com',
            senha: senhaHash,
            cargo: 'Administrador',
            perfilId: perfil.id,
            empresaId: empresa.id,
            status: 'ATIVO'
        },
    });

    // --- Dados Auxiliares ---

    const area = await prisma.areaComercial.create({
        data: {
            empresaId: empresa.id,
            nome: 'Zona Sul',
            descricao: 'Região Sul de SP'
            // regiao removido - nao existe no schema
        }
    });

    const condicaoPagamento = await prisma.condicaoPagamento.create({
        data: {
            empresaId: empresa.id,
            nome: 'Boleto 30 Dias', // Schema usa 'nome', nao 'descricao' como primary label? Verificando schema: tem 'nome' e 'descricao'
            descricao: 'Pagamento em 30 dias',
            ativo: true
            // parcelas, diasParcelas, desconto, jurosMora removidos - nao existem no schema
        }
    });

    const grupoTabela = await prisma.grupoTabelaPreco.create({
        data: {
            empresaId: empresa.id,
            nome: 'Varejo Padrão',
            ativo: true
        }
    });

    // TabelaPreco depende de GrupoTabelaPreco
    const tabelaPreco = await prisma.tabelaPreco.create({
        data: {
            // empresaId removido - nao existe em TabelaPreco (apenas em Grupo)
            grupoId: grupoTabela.id,
            nome: 'Tabela 2024',
            ativo: true
            // tipo removido
        }
    });

    const cliente = await prisma.cliente.create({
        data: {
            empresaId: empresa.id,
            nomeFantasia: 'Cliente Teste Neon',
            razaoSocial: 'Cliente de Teste Neon SA',
            tipo: 'PJ',
            cpfCnpj: '99888777000199',
            email: 'cliente@neon.com',
            status: 'ATIVO',
            limiteCredito: 1000.00,
            areaComercialId: area.id,
            grupoTabelaPrecoId: grupoTabela.id,
            condicoesPagamento: {
                connect: [{ id: condicaoPagamento.id }]
            }
        }
    });

    console.log({ empresa, usuario, cliente });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

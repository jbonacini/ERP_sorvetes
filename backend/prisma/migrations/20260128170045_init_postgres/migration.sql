-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "nomeFantasia" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "inscricaoEstadual" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ATIVA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perfil" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "permissoes" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "cargo" TEXT,
    "perfilId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "ultimoLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogSistema" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT,
    "usuarioId" TEXT,
    "modulo" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "dadosAnteriores" TEXT,
    "dadosNovos" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LogSistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParametroSistema" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" TEXT NOT NULL,
    "grupo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParametroSistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnderecoById" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "codigoIbge" TEXT,

    CONSTRAINT "EnderecoById_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turno" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "inicio" TEXT NOT NULL,
    "fim" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TarefaOperacional" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "colaboradorId" TEXT,
    "turnoId" TEXT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" TEXT NOT NULL,
    "prioridade" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "dataAgendada" TIMESTAMP(3) NOT NULL,
    "dataConclusao" TIMESTAMP(3),
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TarefaOperacional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Colaborador" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "usuarioId" TEXT,
    "turnoId" TEXT,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "cargo" TEXT NOT NULL,
    "dataAdmissao" TIMESTAMP(3),
    "telefone" TEXT,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Colaborador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "nomeFantasia" TEXT NOT NULL,
    "razaoSocial" TEXT,
    "cpfCnpj" TEXT NOT NULL,
    "rgInscricao" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "celular" TEXT,
    "logradouro" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "cep" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "limiteCredito" DECIMAL(65,30) DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "areaComercialId" TEXT,
    "grupoTabelaPrecoId" TEXT,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CondicaoPagamento" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CondicaoPagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AreaComercial" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "vendedorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AreaComercial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrupoTabelaPreco" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrupoTabelaPreco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TabelaPreco" (
    "id" TEXT NOT NULL,
    "grupoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "desconto" DECIMAL(65,30) DEFAULT 0,
    "atividadeCliente" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TabelaPreco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemTabelaPreco" (
    "id" TEXT NOT NULL,
    "tabelaId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "precoVenda" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemTabelaPreco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdemServico" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "clienteId" TEXT,
    "colaboradorId" TEXT,
    "numero" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "prioridade" TEXT NOT NULL DEFAULT 'NORMAL',
    "status" TEXT NOT NULL DEFAULT 'ABERTA',
    "dataAbertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataPrevisao" TIMESTAMP(3),
    "dataFechamento" TIMESTAMP(3),
    "valorTotal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrdemServico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriaProduto" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ATIVA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategoriaProduto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "categoriaId" TEXT,
    "nome" TEXT NOT NULL,
    "codigo" TEXT,
    "descricao" TEXT,
    "tipo" TEXT NOT NULL,
    "unidade" TEXT NOT NULL,
    "precoCusto" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "precoVenda" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "estoqueAtual" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "estoqueMinimo" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "ingredientes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimentacaoEstoque" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "quantidade" DECIMAL(65,30) NOT NULL,
    "valorUnitario" DECIMAL(65,30),
    "motivo" TEXT,
    "documento" TEXT,
    "usuarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovimentacaoEstoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoVenda" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "clienteId" TEXT NOT NULL,
    "vendedorId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ORCAMENTO',
    "dataEmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataValidade" TIMESTAMP(3),
    "valorSubtotal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "valorDesconto" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "valorTotal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "formaPagamento" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PedidoVenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPedidoVenda" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "quantidade" DECIMAL(65,30) NOT NULL,
    "precoUnitario" DECIMAL(65,30) NOT NULL,
    "desconto" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "valorTotal" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemPedidoVenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClienteToCondicaoPagamento" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "Empresa"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ParametroSistema_empresaId_chave_key" ON "ParametroSistema"("empresaId", "chave");

-- CreateIndex
CREATE UNIQUE INDEX "EnderecoById_empresaId_key" ON "EnderecoById"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Colaborador_usuarioId_key" ON "Colaborador"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cpfCnpj_key" ON "Cliente"("cpfCnpj");

-- CreateIndex
CREATE UNIQUE INDEX "_ClienteToCondicaoPagamento_AB_unique" ON "_ClienteToCondicaoPagamento"("A", "B");

-- CreateIndex
CREATE INDEX "_ClienteToCondicaoPagamento_B_index" ON "_ClienteToCondicaoPagamento"("B");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogSistema" ADD CONSTRAINT "LogSistema_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogSistema" ADD CONSTRAINT "LogSistema_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParametroSistema" ADD CONSTRAINT "ParametroSistema_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnderecoById" ADD CONSTRAINT "EnderecoById_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TarefaOperacional" ADD CONSTRAINT "TarefaOperacional_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TarefaOperacional" ADD CONSTRAINT "TarefaOperacional_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "Colaborador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TarefaOperacional" ADD CONSTRAINT "TarefaOperacional_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "Turno"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Colaborador" ADD CONSTRAINT "Colaborador_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Colaborador" ADD CONSTRAINT "Colaborador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Colaborador" ADD CONSTRAINT "Colaborador_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "Turno"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_areaComercialId_fkey" FOREIGN KEY ("areaComercialId") REFERENCES "AreaComercial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_grupoTabelaPrecoId_fkey" FOREIGN KEY ("grupoTabelaPrecoId") REFERENCES "GrupoTabelaPreco"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CondicaoPagamento" ADD CONSTRAINT "CondicaoPagamento_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AreaComercial" ADD CONSTRAINT "AreaComercial_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrupoTabelaPreco" ADD CONSTRAINT "GrupoTabelaPreco_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TabelaPreco" ADD CONSTRAINT "TabelaPreco_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "GrupoTabelaPreco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemTabelaPreco" ADD CONSTRAINT "ItemTabelaPreco_tabelaId_fkey" FOREIGN KEY ("tabelaId") REFERENCES "TabelaPreco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemTabelaPreco" ADD CONSTRAINT "ItemTabelaPreco_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "Colaborador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriaProduto" ADD CONSTRAINT "CategoriaProduto_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "CategoriaProduto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimentacaoEstoque" ADD CONSTRAINT "MovimentacaoEstoque_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimentacaoEstoque" ADD CONSTRAINT "MovimentacaoEstoque_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoVenda" ADD CONSTRAINT "PedidoVenda_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoVenda" ADD CONSTRAINT "PedidoVenda_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedidoVenda" ADD CONSTRAINT "ItemPedidoVenda_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "PedidoVenda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedidoVenda" ADD CONSTRAINT "ItemPedidoVenda_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClienteToCondicaoPagamento" ADD CONSTRAINT "_ClienteToCondicaoPagamento_A_fkey" FOREIGN KEY ("A") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClienteToCondicaoPagamento" ADD CONSTRAINT "_ClienteToCondicaoPagamento_B_fkey" FOREIGN KEY ("B") REFERENCES "CondicaoPagamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

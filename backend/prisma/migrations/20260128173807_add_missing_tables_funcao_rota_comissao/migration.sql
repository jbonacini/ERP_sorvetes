-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "perfilComissaoId" TEXT,
ADD COLUMN     "rotaId" TEXT;

-- CreateTable
CREATE TABLE "FuncaoComercial" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "superiorId" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FuncaoComercial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rota" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerfilComissao" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "regras" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerfilComissao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_rotaId_fkey" FOREIGN KEY ("rotaId") REFERENCES "Rota"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_perfilComissaoId_fkey" FOREIGN KEY ("perfilComissaoId") REFERENCES "PerfilComissao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuncaoComercial" ADD CONSTRAINT "FuncaoComercial_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuncaoComercial" ADD CONSTRAINT "FuncaoComercial_superiorId_fkey" FOREIGN KEY ("superiorId") REFERENCES "FuncaoComercial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rota" ADD CONSTRAINT "Rota_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfilComissao" ADD CONSTRAINT "PerfilComissao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

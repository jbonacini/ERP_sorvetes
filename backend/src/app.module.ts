import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmpresasModule } from './empresas/empresas.module';
import { PerfisModule } from './perfis/perfis.module';
import { ClientesModule } from './clientes/clientes.module';
import { ColaboradoresModule } from './colaboradores/colaboradores.module';
import { AreasComerciaisModule } from './areas-comerciais/areas-comerciais.module';
import { TurnosModule } from './turnos/turnos.module';
import { TarefasModule } from './tarefas/tarefas.module';
import { FuncoesComerciaisModule } from './funcoes-comerciais/funcoes-comerciais.module';
import { TransportadorasModule } from './transportadoras/transportadoras.module';
import { ProdutosModule } from './produtos/produtos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { CondicoesPagamentoModule } from './condicoes-pagamento/condicoes-pagamento.module';
import { TabelasPrecoModule } from './tabelas-preco/tabelas-preco.module';
import { OrdensServicoModule } from './ordens-servico/ordens-servico.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    EmpresasModule,
    ClientesModule,
    ProdutosModule,
    PedidosModule,
    AreasComerciaisModule,
    CondicoesPagamentoModule,
    TabelasPrecoModule,
    TurnosModule,
    TarefasModule,
    OrdensServicoModule,
    FuncoesComerciaisModule,
    TransportadorasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

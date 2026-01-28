import { Module } from '@nestjs/common';
import { CondicoesPagamentoService } from './condicoes-pagamento.service';
import { CondicoesPagamentoController } from './condicoes-pagamento.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [CondicoesPagamentoController],
    providers: [CondicoesPagamentoService],
})
export class CondicoesPagamentoModule { }

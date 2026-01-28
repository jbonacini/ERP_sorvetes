import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TabelasPrecoService } from './tabelas-preco.service';
import { CreateGrupoTabelaDto } from './dto/create-grupo-tabela.dto';
import { UpdateGrupoTabelaDto } from './dto/update-grupo-tabela.dto';
import { CreateTabelaPrecoDto } from './dto/create-tabela-preco.dto';
import { UpdateTabelaPrecoDto } from './dto/update-tabela-preco.dto';

@Controller('tabelas-preco')
export class TabelasPrecoController {
    constructor(private readonly service: TabelasPrecoService) { }

    // ================= GRUPOS =================
    @Post('grupos')
    createGrupo(@Body() createDto: CreateGrupoTabelaDto) {
        return this.service.createGrupo(createDto);
    }

    @Get('grupos')
    findAllGrupos(@Query('empresaId') empresaId: string) {
        return this.service.findAllGrupos(empresaId);
    }

    @Get('grupos/:id')
    findOneGrupo(@Param('id') id: string) {
        return this.service.findOneGrupo(id);
    }

    @Patch('grupos/:id')
    updateGrupo(@Param('id') id: string, @Body() updateDto: UpdateGrupoTabelaDto) {
        return this.service.updateGrupo(id, updateDto);
    }

    @Delete('grupos/:id')
    removeGrupo(@Param('id') id: string) {
        return this.service.removeGrupo(id);
    }

    // ================= TABELAS =================
    @Post('tabelas')
    createTabela(@Body() createDto: CreateTabelaPrecoDto) {
        return this.service.createTabela(createDto);
    }

    @Get('tabelas')
    findAllTabelas(@Query('grupoId') grupoId: string) {
        return this.service.findAllTabelas(grupoId);
    }

    @Get('tabelas/:id')
    findOneTabela(@Param('id') id: string) {
        return this.service.findOneTabela(id);
    }

    @Patch('tabelas/:id')
    updateTabela(@Param('id') id: string, @Body() updateDto: UpdateTabelaPrecoDto) {
        return this.service.updateTabela(id, updateDto);
    }

    @Delete('tabelas/:id')
    removeTabela(@Param('id') id: string) {
        return this.service.removeTabela(id);
    }

    // ================= ITENS =================
    @Post('tabelas/:id/itens')
    upsertItem(
        @Param('id') tabelaId: string,
        @Body() body: { produtoId: string; precoVenda: number },
    ) {
        return this.service.upsertItem(tabelaId, body.produtoId, body.precoVenda);
    }
}

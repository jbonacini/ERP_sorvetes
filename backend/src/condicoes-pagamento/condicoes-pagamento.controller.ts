import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CondicoesPagamentoService } from './condicoes-pagamento.service';
import { CreateCondicaoPagamentoDto } from './dto/create-condicao-pagamento.dto';
import { UpdateCondicaoPagamentoDto } from './dto/update-condicao-pagamento.dto';

@Controller('condicoes-pagamento')
export class CondicoesPagamentoController {
    constructor(private readonly service: CondicoesPagamentoService) { }

    @Post()
    create(@Body() createDto: CreateCondicaoPagamentoDto) {
        return this.service.create(createDto);
    }

    @Get()
    findAll(@Query('empresaId') empresaId: string) {
        return this.service.findAll(empresaId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateCondicaoPagamentoDto) {
        return this.service.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}

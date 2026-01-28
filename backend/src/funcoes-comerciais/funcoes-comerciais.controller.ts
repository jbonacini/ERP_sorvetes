
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FuncoesComerciaisService } from './funcoes-comerciais.service';
import { CreateFuncaoComercialDto } from './dto/create-funcao-comercial.dto';
import { UpdateFuncaoComercialDto } from './dto/update-funcao-comercial.dto';

@Controller('funcoes-comerciais')
export class FuncoesComerciaisController {
    constructor(private readonly service: FuncoesComerciaisService) { }

    @Post()
    create(@Body() createDto: CreateFuncaoComercialDto) {
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
    update(@Param('id') id: string, @Body() updateDto: UpdateFuncaoComercialDto) {
        return this.service.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}

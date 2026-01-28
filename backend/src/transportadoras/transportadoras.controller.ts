
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TransportadorasService } from './transportadoras.service';
import { CreateTransportadoraDto } from './dto/create-transportadora.dto';
import { UpdateTransportadoraDto } from './dto/update-transportadora.dto';

@Controller('transportadoras')
export class TransportadorasController {
    constructor(private readonly service: TransportadorasService) { }

    @Post()
    create(@Body() createDto: CreateTransportadoraDto) {
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
    update(@Param('id') id: string, @Body() updateDto: UpdateTransportadoraDto) {
        return this.service.update(id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}

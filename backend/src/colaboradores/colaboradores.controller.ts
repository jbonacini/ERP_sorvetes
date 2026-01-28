import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ColaboradoresService } from './colaboradores.service';
import { CreateColaboradorDto } from './dto/create-colaborador.dto';
import { UpdateColaboradorDto } from './dto/update-colaborador.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('colaboradores')
export class ColaboradoresController {
  constructor(private readonly colaboradoresService: ColaboradoresService) { }

  @Post()
  create(@Body() createDto: CreateColaboradorDto) {
    return this.colaboradoresService.create(createDto);
  }

  @Get()
  findAll() {
    return this.colaboradoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colaboradoresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateColaboradorDto) {
    return this.colaboradoresService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colaboradoresService.remove(id);
  }
}

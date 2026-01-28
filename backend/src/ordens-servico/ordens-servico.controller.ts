import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrdensServicoService } from './ordens-servico.service';
import { CreateOrdensServicoDto } from './dto/create-ordens-servico.dto';
import { UpdateOrdensServicoDto } from './dto/update-ordens-servico.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ordens-servico')
export class OrdensServicoController {
  constructor(private readonly ordensServicoService: OrdensServicoService) { }

  @Post()
  create(@Body() createOrdensServicoDto: CreateOrdensServicoDto) {
    return this.ordensServicoService.create(createOrdensServicoDto);
  }

  @Get()
  findAll() {
    return this.ordensServicoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordensServicoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrdensServicoDto: UpdateOrdensServicoDto) {
    return this.ordensServicoService.update(id, updateOrdensServicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordensServicoService.remove(id);
  }
}

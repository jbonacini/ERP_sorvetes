import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AreasComerciaisService } from './areas-comerciais.service';
import { CreateAreasComerciaiDto } from './dto/create-areas-comerciai.dto';
import { UpdateAreasComerciaiDto } from './dto/update-areas-comerciai.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('areas-comerciais')
export class AreasComerciaisController {
  constructor(private readonly areasComerciaisService: AreasComerciaisService) { }

  @Post()
  create(@Body() createAreasComerciaiDto: CreateAreasComerciaiDto) {
    return this.areasComerciaisService.create(createAreasComerciaiDto);
  }

  @Get()
  findAll() {
    return this.areasComerciaisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.areasComerciaisService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAreasComerciaiDto: UpdateAreasComerciaiDto) {
    return this.areasComerciaisService.update(id, updateAreasComerciaiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.areasComerciaisService.remove(id);
  }
}

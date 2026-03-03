import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReglasPrecioService } from './reglas_precio.service';
import { CreateReglasPrecioDto } from './dto/create-reglas_precio.dto';
import { UpdateReglasPrecioDto } from './dto/update-reglas_precio.dto';

@Controller('reglas-precio')
export class ReglasPrecioController {
  constructor(private readonly reglasPrecioService: ReglasPrecioService) {}

  @Post()
  create(@Body() createReglasPrecioDto: CreateReglasPrecioDto) {
    return this.reglasPrecioService.create(createReglasPrecioDto);
  }

  @Get()
  findAll() {
    return this.reglasPrecioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reglasPrecioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReglasPrecioDto: UpdateReglasPrecioDto) {
    return this.reglasPrecioService.update(+id, updateReglasPrecioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reglasPrecioService.remove(+id);
  }
}

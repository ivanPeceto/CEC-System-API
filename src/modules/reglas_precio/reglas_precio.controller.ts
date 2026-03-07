import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReglasPrecioService } from './reglas_precio.service';
import { CreateReglasPrecioDto } from './dto/create-reglas_precio.dto';
import { UpdateReglasPrecioDto } from './dto/update-reglas_precio.dto';
import { Role } from 'src/common/decorators/roles/roles.decorator';
import { Roles } from 'src/types/users.types';

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
    return this.reglasPrecioService.findOne(id);
  }

  @Get('producto/:id')
  findOneByProducto(@Param('id') id: string) {
    return this.reglasPrecioService.findManyByProducto(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReglasPrecioDto: UpdateReglasPrecioDto,
  ) {
    return this.reglasPrecioService.update(id, updateReglasPrecioDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.reglasPrecioService.delete(id);
  }

  @Role(Roles.ADMIN)
  @Delete(':id/hard')
  delete(@Param('id') id: string) {
    return this.reglasPrecioService.delete(id);
  }

  @Role(Roles.ADMIN)
  @Patch('restore/:id')
  restore(@Param('id') id: string) {
    return this.reglasPrecioService.restore(id);
  }
}

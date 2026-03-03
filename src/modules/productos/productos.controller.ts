import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Role } from 'src/common/decorators/roles/roles.decorator';
import { Roles } from 'src/types/users.types';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(id);
  }

  @Get('nombre/:name')
  findOneByName(@Param('name') name: string) {
    return this.productosService.findOneByName(name);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.productosService.softDelete(id);
  }

  @Role(Roles.ADMIN)
  @Delete(':id/hard')
  hardDelete(@Param('id') id: string) {
    return this.productosService.delete(id);
  }

  @Role(Roles.ADMIN)
  @Patch('restore/:id')
  restore(@Param('id') id: string) {
    return this.productosService.restore(id);
  }
}

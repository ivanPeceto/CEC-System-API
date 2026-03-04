import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PedidoProductoService } from './pedido-producto.service';
import { CreatePedidoProductoDto } from './dto/create-pedido-producto.dto';
import { UpdatePedidoProductoDto } from './dto/update-pedido-producto.dto';

@Controller('pedido-producto')
export class PedidoProductoController {
  constructor(private readonly pedidoProductoService: PedidoProductoService) {}

  @Post()
  create(@Body() createPedidoProductoDto: CreatePedidoProductoDto) {
    return this.pedidoProductoService.create(createPedidoProductoDto);
  }

  @Get()
  findAll() {
    return this.pedidoProductoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidoProductoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePedidoProductoDto: UpdatePedidoProductoDto) {
    return this.pedidoProductoService.update(+id, updatePedidoProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pedidoProductoService.remove(+id);
  }
}

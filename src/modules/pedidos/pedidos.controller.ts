import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Role } from 'src/common/decorators/roles/roles.decorator';
import { Roles } from 'src/types/users.types';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.createPedido(createPedidoDto);
  }

  @Get()
  findAll() {
    return this.pedidosService.findAll();
  }

  @Role(Roles.ADMIN)
  @Get('deleted')
  findAllDeleted() {
    return this.pedidosService.findSoftDeleted();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(id);
  }

  @Get('fecha/:date')
  findManyByDate(@Param('date') date: Date) {
    return this.pedidosService.findManyByDate(date);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidosService.update(id, updatePedidoDto);
  }

  @Delete(':id')
  softRemove(@Param('id') id: string) {
    return this.pedidosService.deleteCascade(id);
  }

  @Role(Roles.ADMIN)
  @Delete(':id/hard')
  hardRemove(@Param('id') id: string) {
    return this.pedidosService.hardDeleteCascade(id);
  }

  @Role(Roles.ADMIN)
  @Patch('restore/:id')
  restore(@Param('id') id: string) {
    return this.pedidosService.restore(id);
  }
}

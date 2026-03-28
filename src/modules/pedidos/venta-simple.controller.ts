import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreateVentaSimpleDto } from './dto/create-venta-simple.dto';
import { Role } from 'src/common/decorators/roles/roles.decorator';
import { Roles } from 'src/types/users.types';
import { UpdateVentaSimpleDto } from './dto/update-venta-simple.dto';

@Controller('venta-simple')
export class VentaSimpleController {
  constructor(private readonly pedidoService: PedidosService) {}

  @Post()
  create(@Body() createVentaSimpleDto: CreateVentaSimpleDto) {
    return this.pedidoService.createVentaSimple(createVentaSimpleDto);
  }

  @Get()
  findAll() {
    return this.pedidoService.findAll(true);
  }

  @Role(Roles.ADMIN)
  @Get('deleted')
  findAllDeleted() {
    return this.pedidoService.findSoftDeleted(true);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidoService.findOne(id, true);
  }

  @Get('fecha/:date')
  findManyByDate(@Param('date') date: Date) {
    return this.pedidoService.findManyByDate(date, true);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVentaSimpleDto: UpdateVentaSimpleDto,
  ) {
    return this.pedidoService.updateVentaSimple(id, updateVentaSimpleDto);
  }

  @Delete(':id')
  softRemove(@Param('id') id: string) {
    return this.pedidoService.deleteCascade(id, true);
  }

  @Role(Roles.ADMIN)
  @Delete(':id/hard')
  hardRemove(@Param('id') id: string) {
    return this.pedidoService.hardDeleteCascade(id, true);
  }

  @Role(Roles.ADMIN)
  @Patch('restore/:id')
  restore(@Param('id') id: string) {
    return this.pedidoService.restore(id, true);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-clliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Role } from 'src/common/decorators/roles/roles.decorator';
import { Roles } from 'src/types/users.types';

@Controller('clientes')
export class ClientesController {
  constructor(private clientesService: ClientesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(id, updateClienteDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.clientesService.softDelete(id);
  }

  @Role(Roles.ADMIN)
  @Delete(':id/hard')
  hardDelete(@Param('id') id: string) {
    return this.clientesService.delete(id);
  }

  @Role(Roles.ADMIN)
  @Patch('restore/:id')
  restore(@Param('id') id: string) {
    return this.clientesService.restore(id);
  }

  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  @Role(Roles.ADMIN)
  @Get('deleted')
  findSoftDeleted() {
    return this.clientesService.findSoftDeleted();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(id);
  }

  @Get('/nombre/:name')
  findManyByName(@Param('name') nombre: string) {
    return this.clientesService.findManyByName(nombre);
  }
}

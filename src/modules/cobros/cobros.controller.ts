import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CobrosService } from './cobros.service';
import { CreateCobroDto } from './dto/create-cobro.dto';
import { UpdateCobroDto } from './dto/update-cobro.dto';
import { Role } from 'src/common/decorators/roles/roles.decorator';
import { Roles } from 'src/types/users.types';

@Controller('cobros')
export class CobrosController {
  constructor(private readonly cobrosService: CobrosService) {}

  @Post()
  create(@Body() createCobroDto: CreateCobroDto) {
    return this.cobrosService.create(createCobroDto);
  }

  @Get()
  findAll() {
    return this.cobrosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cobrosService.findOne(id);
  }

  @Get('facturables')
  findAllFacturables() {
    return this.cobrosService.findAllFacturables();
  }

  @Get('pedido/:id')
  findAllByPedido(@Param('id') id: string) {
    return this.cobrosService.findAllByPedido(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCobroDto: UpdateCobroDto) {
    return this.cobrosService.update(id, updateCobroDto);
  }

  @Role(Roles.ADMIN)
  @Patch(':id')
  restore(@Param('id') id: string) {
    return this.cobrosService.restore(id);
  }

  @Role(Roles.ADMIN)
  @Delete(':id/hard')
  hardRemove(@Param('id') id: string) {
    return this.cobrosService.hardDelete(id);
  }

  @Delete(':id')
  softRemove(@Param('id') id: string) {
    return this.cobrosService.delete(id);
  }
}

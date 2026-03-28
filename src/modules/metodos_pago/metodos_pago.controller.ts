import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MetodosPagoService } from './metodos_pago.service';
import { CreateMetodosPagoDto } from './dto/create-metodos_pago.dto';
import { UpdateMetodosPagoDto } from './dto/update-metodos_pago.dto';
import { Role } from 'src/common/decorators/roles/roles.decorator';
import { Roles } from 'src/types/users.types';

@Controller('metodos-pago')
export class MetodosPagoController {
  constructor(private readonly metodosPagoService: MetodosPagoService) {}

  @Post()
  create(@Body() createMetodosPagoDto: CreateMetodosPagoDto) {
    return this.metodosPagoService.create(createMetodosPagoDto);
  }

  @Get()
  findAll() {
    return this.metodosPagoService.findAll();
  }

  @Role(Roles.ADMIN)
  @Get('deleted')
  findAllSoftDel() {
    return this.metodosPagoService.findSoftDeleted();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metodosPagoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMetodosPagoDto: UpdateMetodosPagoDto,
  ) {
    return this.metodosPagoService.update(id, updateMetodosPagoDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.metodosPagoService.softDelete(id);
  }

  @Role(Roles.ADMIN)
  @Delete(':id/hard')
  hardDelete(@Param('id') id: string) {
    return this.metodosPagoService.delete(id);
  }

  @Role(Roles.ADMIN)
  @Patch('restore/:id')
  restore(@Param('id') id: string) {
    return this.metodosPagoService.restore(id);
  }
}

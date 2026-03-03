import { Injectable } from '@nestjs/common';
import { CreateReglasPrecioDto } from './dto/create-reglas_precio.dto';
import { UpdateReglasPrecioDto } from './dto/update-reglas_precio.dto';

@Injectable()
export class ReglasPrecioService {
  create(createReglasPrecioDto: CreateReglasPrecioDto) {
    return 'This action adds a new reglasPrecio';
  }

  findAll() {
    return `This action returns all reglasPrecio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reglasPrecio`;
  }

  update(id: number, updateReglasPrecioDto: UpdateReglasPrecioDto) {
    return `This action updates a #${id} reglasPrecio`;
  }

  remove(id: number) {
    return `This action removes a #${id} reglasPrecio`;
  }
}

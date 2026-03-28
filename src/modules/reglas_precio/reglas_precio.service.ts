import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReglasPrecioDto } from './dto/create-reglas_precio.dto';
import { UpdateReglasPrecioDto } from './dto/update-reglas_precio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReglasPrecio } from './entities/reglas_precio.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { ProductosService } from '../productos/productos.service';

@Injectable()
export class ReglasPrecioService {
  constructor(
    @InjectRepository(ReglasPrecio)
    private readonly reglasRepo: Repository<ReglasPrecio>,
    private readonly productosService: ProductosService,
  ) {}
  async create(createReglasPrecioDto: CreateReglasPrecioDto) {
    const producto = await this.productosService.findOne(
      createReglasPrecioDto.producto,
    );
    const regla_precio = this.reglasRepo.create({
      cantidad_producto: createReglasPrecioDto.cantidad_producto,
      precio_fijo: createReglasPrecioDto.precio_fijo,
      producto: producto,
    });
    return await this.reglasRepo.save(regla_precio);
  }

  async findAll(): Promise<ReglasPrecio[]> {
    return await this.reglasRepo.find();
  }

  async findOne(id: string): Promise<ReglasPrecio> {
    const regla_precio = await this.reglasRepo.findOne({
      where: { id },
    });
    if (!regla_precio) {
      throw new NotFoundException(
        `Regla de precio con id ${id} no encontrada.`,
      );
    }
    return regla_precio;
  }

  async findManyByProducto(productoId: string): Promise<ReglasPrecio[]> {
    //Validate id
    /*const producto = await this.productosService.findOne(productoId);
    const regla_precio = await this.reglasRepo.find({
      where: { producto: producto },
    });*/
    const producto = await this.productosService.findOne(productoId);
    const reglas_precio: ReglasPrecio[] = await this.reglasRepo.query(
      'SELECT * FROM reglas_precio WHERE productoId = ? ORDER BY cantidad_producto DESC',
      [producto.id],
    );
    if (reglas_precio.length === 0) {
      throw new NotFoundException(
        `Regla de precio con producto asociado de id ${productoId} no encontrada.`,
      );
    }
    return reglas_precio;
  }

  async update(id: string, updateReglasPrecioDto: UpdateReglasPrecioDto) {
    const regla_precio = await this.findOne(id);
    if (updateReglasPrecioDto.producto) {
      //Validates id
      const producto = await this.productosService.findOne(
        updateReglasPrecioDto.producto,
      );
      regla_precio.producto = producto;
    }
    regla_precio.cantidad_producto =
      updateReglasPrecioDto.cantidad_producto ?? regla_precio.cantidad_producto;
    regla_precio.precio_fijo =
      updateReglasPrecioDto.precio_fijo ?? regla_precio.precio_fijo;
    return await this.reglasRepo.save(regla_precio);
  }

  async delete(id: string) {
    const regla_precio = await this.findOne(id);
    return await this.reglasRepo.softRemove(regla_precio);
  }

  async softDelete(id: string) {
    const regla_precio = await this.findOne(id);
    return await this.reglasRepo.remove(regla_precio);
  }

  async restore(id: string) {
    const regla_precio = await this.reglasRepo.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!regla_precio) {
      throw new NotFoundException(
        `Regla de precio con id ${id} no encontrada.`,
      );
    }
    return await this.reglasRepo.recover(regla_precio);
  }

  async findSoftDeleted(): Promise<ReglasPrecio[]> {
    return await this.reglasRepo.find({
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull()), 
      },
    });
  }
}

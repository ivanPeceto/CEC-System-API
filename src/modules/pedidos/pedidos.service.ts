import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { Between, IsNull, Repository, Not } from 'typeorm';
import { PedidoProducto } from '../pedido-producto/entities/pedido-producto.entity';
import { ClientesService } from '../clientes/clientes.service';
import { Estados } from 'src/types/pedidos.types';
import { ReglasPrecioService } from '../reglas_precio/reglas_precio.service';
import { ProductosService } from '../productos/productos.service';
import { CreateVentaSimpleDto } from './dto/create-venta-simple.dto';
import { UpdateVentaSimpleDto } from './dto/update-venta-simple.dto';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidosRepo: Repository<Pedido>,
    @InjectRepository(PedidoProducto)
    private readonly pedidosProductosRepo: Repository<PedidoProducto>,
    private readonly clientesService: ClientesService,
    private readonly reglasService: ReglasPrecioService,
    private readonly productoService: ProductosService,
  ) {}

  async createPedido(createPedidoDto: CreatePedidoDto) {
    //Validates cliente id
    const cliente = await this.clientesService.findOne(createPedidoDto.cliente);

    if (createPedidoDto.pedido_productos.length === 0) {
      throw new BadRequestException(
        'Un pedido debe tener al menos un producto relacionado.',
      );
    }

    const pedidoDate = createPedidoDto.datetime
      ? createPedidoDto.datetime
      : new Date();

    const countPedidos = await this.countPedidosByDate(pedidoDate);
    const pedidoNumero: number = createPedidoDto.numero
      ? createPedidoDto.numero
      : countPedidos + 1;

    const pedido = this.pedidosRepo.create({
      datetime: pedidoDate,
      numero: pedidoNumero,
      cliente: cliente,
      para_hora: createPedidoDto.para_hora,
      estado: createPedidoDto.estado ?? Estados.PENDIENTE,
      pagado: createPedidoDto.pagado ?? false,
      avisado: createPedidoDto.avisado ?? false,
    });

    const productosIds = createPedidoDto.pedido_productos.map(
      (item) => item.producto,
    );
    const productosFromRepo =
      await this.productoService.findManyByIdList(productosIds);

    if (productosFromRepo.length !== productosIds.length) {
      throw new BadRequestException(
        'Uno o más productos no existen en la base de datos.',
      );
    }

    let total: number = 0;

    // Creates middle entities and calculates prices
    // Checks for existing price rules and calculates sub-price based on it
    pedido.pedido_productos = await Promise.all(
      createPedidoDto.pedido_productos.map(async (prod) => {
        const relation = new PedidoProducto();

        relation.pedido = pedido;
        let subtotal = 0;

        const producto = productosFromRepo.find((p) => p.id === prod.producto);
        if (producto === undefined) {
          throw new BadRequestException(
            'Fallo al asignar productos. Uno o más productos no existen en la BDD',
          );
        }
        const reglas_precio = await this.reglasService.findManyByProducto(
          producto.id,
        );

        let restante_prod = parseFloat(prod.cantidad_producto);
        if (reglas_precio.length > 0) {
          for (const regla of reglas_precio) {
            if (restante_prod === 0) continue;

            const result: number = Math.trunc(
              restante_prod / parseFloat(regla.cantidad_producto),
            );
            restante_prod =
              restante_prod - result * parseFloat(regla.cantidad_producto);

            subtotal += parseFloat(regla.precio_fijo) * result;
          }
          subtotal += restante_prod * parseFloat(producto.precio_unitario);
        } else {
          subtotal +=
            parseFloat(prod.cantidad_producto) *
            parseFloat(producto.precio_unitario);
        }

        relation.producto = producto;
        relation.cantidad_producto = prod.cantidad_producto;
        relation.aclaraciones = prod.aclaraciones;
        relation.subtotal = subtotal.toFixed(2);

        total += subtotal;
        return relation;
      }),
    );
    // End middle entities

    pedido.total = total.toFixed(2);
    return this.pedidosRepo.save(pedido);
  }

  async findAll(es_venta_simple: boolean = false) {
    return await this.pedidosRepo.find({
      relations: {
        pedido_productos: {
          producto: true,
        },
        cliente: true,
      },
      where: {
        es_venta_simple: es_venta_simple,
      },
    });
  }

  async findOne(id: string, es_venta_simple: boolean = false) {
    const pedido = await this.pedidosRepo.findOne({
      where: {
        id: id,
        es_venta_simple: es_venta_simple,
      },
      relations: ['pedido_productos', 'pedido_productos.producto', 'cliente'],
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado.`);
    }
    return pedido;
  }

  async findManyByDate(date: Date, es_venta_simple: boolean = false) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    const pedidos: Pedido[] = await this.pedidosRepo.find({
      where: {
        datetime: Between(startDate, endDate),
        es_venta_simple: es_venta_simple,
      },
      relations: ['pedido_productos', 'pedido_productos.producto', 'cliente'],
    });
    return pedidos;
  }

  async findOneByDateAndNumero(
    date: Date,
    number: number,
    es_venta_simple: boolean = false,
  ) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    const pedido = await this.pedidosRepo.findOne({
      where: {
        datetime: Between(startDate, endDate),
        numero: number,
        es_venta_simple: es_venta_simple,
      },
      relations: ['pedido_productos', 'pedido_productos.producto', 'cliente'],
    });
    return pedido;
  }

  async countPedidosByDate(date: Date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    const total_pedidos = await this.pedidosRepo.count({
      where: {
        datetime: Between(startDate, endDate),
        es_venta_simple: false,
      },
    });
    return total_pedidos;
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto) {
    if (
      updatePedidoDto.pedido_productos &&
      updatePedidoDto.pedido_productos.length === 0
    ) {
      throw new BadRequestException(
        'Todo pedido debe tener asociado al menos un producto.',
      );
    }
    const pedido = await this.findOne(id);

    Object.assign(pedido, {
      datetime: updatePedidoDto.datetime ?? pedido.datetime,
      numero: updatePedidoDto.numero ?? pedido.numero,
      para_hora: updatePedidoDto.para_hora ?? pedido.para_hora,
      estado: updatePedidoDto.estado ?? pedido.estado,
      pagado: updatePedidoDto.pagado ?? pedido.pagado,
      avisado: updatePedidoDto.pagado ?? pedido.avisado,
    });

    if (updatePedidoDto.cliente) {
      const cliente = await this.clientesService.findOne(
        updatePedidoDto.cliente,
      );
      pedido.cliente = cliente;
    }

    if (updatePedidoDto.pedido_productos) {
      const productosIds = updatePedidoDto.pedido_productos.map(
        (item) => item.producto,
      );
      const productosFromRepo =
        await this.productoService.findManyByIdList(productosIds);

      if (productosFromRepo.length !== productosIds.length) {
        throw new BadRequestException(
          'Uno o más productos no existen en la base de datos.',
        );
      }

      let total: number = 0;
      // Checks for existint middle entities
      // If they don't exist, it creates middle entities and calculates prices
      // Checks for existing price rules and calculates sub-price based on it
      pedido.pedido_productos = await Promise.all(
        updatePedidoDto.pedido_productos.map(async (prod) => {
          let relation = pedido.pedido_productos.find(
            (pp) => pp.producto.id === prod.producto,
          );

          let subtotal = 0;

          if (!relation) {
            relation = new PedidoProducto();
            relation.pedido = pedido;
          }

          const producto = productosFromRepo.find(
            (p) => p.id === prod.producto,
          );
          if (producto === undefined) {
            throw new BadRequestException(
              'Uno o más productos proporcionados no existen en la BDD.',
            );
          }

          const reglas_precio = await this.reglasService.findManyByProducto(
            producto.id,
          );
          let restante_prod = parseFloat(prod.cantidad_producto);
          if (reglas_precio.length > 0) {
            for (const regla of reglas_precio) {
              if (restante_prod === 0) continue;

              const result: number = Math.trunc(
                restante_prod / parseFloat(regla.cantidad_producto),
              );
              restante_prod =
                restante_prod - result * parseFloat(regla.cantidad_producto);

              subtotal += parseFloat(regla.precio_fijo) * result;
            }
            subtotal += restante_prod * parseFloat(producto.precio_unitario);
          } else {
            subtotal +=
              parseFloat(prod.cantidad_producto) *
              parseFloat(producto.precio_unitario);
          }

          relation.producto = producto;
          relation.cantidad_producto = prod.cantidad_producto;
          relation.aclaraciones = prod.aclaraciones;
          relation.subtotal = subtotal.toFixed(2);

          total += subtotal;
          return relation;
        }),
      );
      // End middle entites

      pedido.total = total.toFixed(2);
    }
    return this.pedidosRepo.save(pedido);
  }

  async deleteCascade(id: string, es_venta_simple: boolean = false) {
    const pedido = await this.findOne(id, es_venta_simple);
    await this.pedidosRepo.softRemove(pedido);
  }

  async hardDeleteCascade(id: string, es_venta_simple: boolean = false) {
    const pedido = await this.findOne(id, es_venta_simple);
    await this.pedidosRepo.remove(pedido);
  }

  async restore(id: string, es_venta_simple: boolean = false) {
    const pedido = await this.pedidosRepo.findOne({
      where: {
        id: id,
        es_venta_simple: es_venta_simple,
      },
      relations: ['pedido_productos', 'pedido_productos.producto', 'cliente'],
      withDeleted: true,
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`);
    }
    return await this.pedidosRepo.recover(pedido);
  }

  async findSoftDeleted(es_venta_simple: boolean = false) {
    const deletedPedidos = await this.pedidosRepo.find({
      relations: ['pedido_productos', 'pedido_productos.producto', 'cliente'],
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull()),
        es_venta_simple: es_venta_simple,
      },
    });
    return deletedPedidos;
  }

  async createVentaSimple(createVentaSimpleDto: CreateVentaSimpleDto) {
    if (createVentaSimpleDto.pedido_productos.length === 0) {
      throw new BadRequestException(
        'Un pedido debe tener al menos un producto relacionado.',
      );
    }

    const pedidoDate = createVentaSimpleDto.datetime
      ? createVentaSimpleDto.datetime
      : new Date();

    const venta = this.pedidosRepo.create({
      datetime: pedidoDate,
      numero: 999,
      cliente: undefined,
      para_hora: undefined,
      estado: Estados.ENTREGADO,
      pagado: true,
      avisado: false,
      es_venta_simple: true,
    });

    const productosIds = createVentaSimpleDto.pedido_productos.map(
      (item) => item.producto,
    );

    const productosFromRepo =
      await this.productoService.findManyByIdList(productosIds);

    if (productosFromRepo.length !== productosIds.length) {
      throw new BadRequestException(
        'Uno o más productos no existen en la base de datos.',
      );
    }

    let total = 0;
    //Same logic as createPedido method
    venta.pedido_productos = await Promise.all(
      createVentaSimpleDto.pedido_productos.map(async (prod) => {
        const relation = new PedidoProducto();

        relation.pedido = venta;
        let subtotal = 0;

        const producto = productosFromRepo.find((p) => p.id === prod.producto);
        if (producto === undefined) {
          throw new BadRequestException(
            'Fallo al asignar productos. Uno o más productos no existen en la BDD',
          );
        }
        const reglas_precio = await this.reglasService.findManyByProducto(
          producto.id,
        );

        let restante_prod = parseFloat(prod.cantidad_producto);
        if (reglas_precio.length > 0) {
          for (const regla of reglas_precio) {
            if (restante_prod === 0) continue;

            const result: number = Math.trunc(
              restante_prod / parseFloat(regla.cantidad_producto),
            );
            restante_prod =
              restante_prod - result * parseFloat(regla.cantidad_producto);

            subtotal += parseFloat(regla.precio_fijo) * result;
          }
          subtotal += restante_prod * parseFloat(producto.precio_unitario);
        } else {
          subtotal +=
            parseFloat(prod.cantidad_producto) *
            parseFloat(producto.precio_unitario);
        }

        relation.producto = producto;
        relation.cantidad_producto = prod.cantidad_producto;
        relation.aclaraciones = prod.aclaraciones;
        relation.subtotal = subtotal.toFixed(2);

        total += subtotal;
        return relation;
      }),
    );

    venta.total = total.toFixed(2);
    return this.pedidosRepo.save(venta);
  }

  async updateVentaSimple(
    id: string,
    updateVentaSimpleDto: UpdateVentaSimpleDto,
  ) {
    if (
      updateVentaSimpleDto.pedido_productos &&
      updateVentaSimpleDto.pedido_productos.length === 0
    ) {
      throw new BadRequestException(
        'Todo pedido debe tener asociado al menos un producto.',
      );
    }
    const venta = await this.findOne(id, true);

    Object.assign(venta, {
      datetime: updateVentaSimpleDto.datetime ?? venta.datetime,
    });

    if (updateVentaSimpleDto.pedido_productos) {
      const productosIds = updateVentaSimpleDto.pedido_productos.map(
        (item) => item.producto,
      );
      const productosFromRepo =
        await this.productoService.findManyByIdList(productosIds);

      if (productosFromRepo.length !== productosIds.length) {
        throw new BadRequestException(
          'Uno o más productos no existen en la base de datos.',
        );
      }

      let total: number = 0;
      // Checks for existint middle entities
      // If they don't exist, it creates middle entities and calculates prices
      // Checks for existing price rules and calculates sub-price based on it
      venta.pedido_productos = await Promise.all(
        updateVentaSimpleDto.pedido_productos.map(async (prod) => {
          let relation = venta.pedido_productos.find(
            (pp) => pp.producto.id === prod.producto,
          );

          let subtotal = 0;

          if (!relation) {
            relation = new PedidoProducto();
            relation.pedido = venta;
          }

          const producto = productosFromRepo.find(
            (p) => p.id === prod.producto,
          );
          if (producto === undefined) {
            throw new BadRequestException(
              'Uno o más productos proporcionados no existen en la BDD.',
            );
          }

          const reglas_precio = await this.reglasService.findManyByProducto(
            producto.id,
          );

          let restante_prod = parseFloat(prod.cantidad_producto);
          if (reglas_precio.length > 0) {
            for (const regla of reglas_precio) {
              if (restante_prod === 0) continue;

              const result: number = Math.trunc(
                restante_prod / parseFloat(regla.cantidad_producto),
              );
              restante_prod =
                restante_prod - result * parseFloat(regla.cantidad_producto);

              subtotal += parseFloat(regla.precio_fijo) * result;
            }
            subtotal += restante_prod * parseFloat(producto.precio_unitario);
          } else {
            subtotal +=
              parseFloat(prod.cantidad_producto) *
              parseFloat(producto.precio_unitario);
          }

          relation.producto = producto;
          relation.cantidad_producto = prod.cantidad_producto;
          relation.aclaraciones = prod.aclaraciones;
          relation.subtotal = subtotal.toFixed(2);

          total += subtotal;
          return relation;
        }),
      );
      // End middle entites

      venta.total = total.toFixed(2);
    }
    return this.pedidosRepo.save(venta);
  }
}

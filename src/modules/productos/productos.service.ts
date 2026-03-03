import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { RecetasService } from '../recetas/recetas.service';
import { CategoriasService } from '../categorias/categorias.service';
import { Receta } from '../recetas/entities/receta.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productosRepository: Repository<Producto>,
    private readonly recetasService: RecetasService,
    private readonly categoriaService: CategoriasService,
  ) {}

  async create(createProductoDto: CreateProductoDto) {
    const producto = this.productosRepository.create({
      nombre: createProductoDto.nombre,
      nombre_impresion: createProductoDto.nombre_impresion,
      descripcion: createProductoDto.descripcion,
      precio_unitario: createProductoDto.precio_unitario,
      margen_beneficio: createProductoDto.margen_beneficio,
      cantidad_receta: createProductoDto.cantidad_receta,
    });

    const categoriaValidated = await this.categoriaService.findOne(
      createProductoDto.categoria,
    );
    producto.categoria = categoriaValidated;

    if (createProductoDto.receta && createProductoDto.cantidad_receta) {
      const receta = await this.recetasService.findOne(
        createProductoDto.receta,
      );
      producto.receta = receta;
      producto.cantidad_receta = createProductoDto.cantidad_receta;
      this.calculateAndUpdatePrecioEstimado(producto, producto.receta);
    }

    return await this.productosRepository.save(producto);
  }

  calculateAndUpdatePrecioEstimado(producto: Producto, receta: Receta) {
    const costo_receta = parseFloat(receta.costo_unidad);
    const cantidad_receta = parseFloat(producto.cantidad_receta);
    const margen_porcentual = 1 + parseFloat(producto.margen_beneficio) / 100;

    const costo_estimado =
      cantidad_receta > 0
        ? (costo_receta * cantidad_receta * margen_porcentual).toFixed(2)
        : '0';

    producto.precio_estimado = costo_estimado;
  }

  async findAll() {
    return await this.productosRepository.find({
      relations: ['categoria', 'receta'],
    });
  }

  async findOne(id: string) {
    const producto = await this.productosRepository.findOne({
      where: { id: id },
      relations: ['categoria', 'receta'],
    });
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado.`);
    }
    return producto;
  }

  async findOneByName(name: string) {
    const producto = await this.productosRepository.find({
      where: { nombre: name },
      relations: ['categoria', 'receta'],
    });
    if (!producto) {
      throw new NotFoundException(`Producto con nombre ${name} no encontrado.`);
    }
    return producto;
  }

  async findProductsByCategory(categoriaId: string) {
    //Validates id
    const categoriaValidated = await this.categoriaService.findOne(categoriaId);
    const productos = await this.productosRepository.find({
      where: { categoria: { id: categoriaValidated.id } },
      relations: ['categoria', 'receta'],
    });

    return productos;
  }

  async findProductosByReceta(receta: Receta): Promise<Producto[]> {
    const productos: Producto[] = await this.productosRepository.find({
      where: {
        receta: receta,
      },
    });
    return productos;
  }

  async update(id: string, updateProductoDto: UpdateProductoDto) {
    const producto = await this.findOne(id);
    Object.assign(producto, {
      nombre: updateProductoDto.nombre ?? producto.nombre,
      nombre_impresion:
        updateProductoDto.nombre_impresion ?? producto.nombre_impresion,
      descripcion: updateProductoDto.descripcion ?? producto.descripcion,
      precio_unitario:
        updateProductoDto.precio_unitario ?? producto.precio_unitario,
      categoria: updateProductoDto.categoria ?? producto.categoria,
      margen_beneficio:
        updateProductoDto.margen_beneficio ?? producto.margen_beneficio,
    });

    if (updateProductoDto.receta) {
      const receta = await this.recetasService.findOne(
        updateProductoDto.receta,
      );
      producto.receta = receta;
      producto.cantidad_receta =
        updateProductoDto.cantidad_receta ?? producto.cantidad_receta;
      this.calculateAndUpdatePrecioEstimado(producto, producto.receta);
    }

    return await this.productosRepository.save(producto);
  }

  async delete(id: string): Promise<void> {
    const producto = await this.findOne(id);
    await this.productosRepository.remove(producto);
  }

  async softDelete(id: string): Promise<void> {
    const producto = await this.findOne(id);
    await this.productosRepository.softRemove(producto);
  }

  async restore(id: string): Promise<void> {
    const producto = await this.productosRepository.findOne({
      where: { id },
      relations: ['categoria', 'receta'],
      withDeleted: true,
    });
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado.`);
    }
    await this.productosRepository.recover(producto);
  }
}

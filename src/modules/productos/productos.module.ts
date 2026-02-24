import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
import { Receta } from '../recetas/entities/receta.entity';
import { Categoria } from '../categorias/entities/categoria.entity';

@Module({
  imports: [Producto, Receta, Categoria],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}

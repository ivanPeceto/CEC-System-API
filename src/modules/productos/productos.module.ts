import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
import { Receta } from '../recetas/entities/receta.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetasModule } from '../recetas/recetas.module';
import { CategoriasModule } from '../categorias/categorias.module';
import { RecetaPriceUpdatedListener } from './listeners/receta-price-updated.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, Receta, Categoria]),
    RecetasModule,
    CategoriasModule,
  ],
  controllers: [ProductosController],
  providers: [ProductosService, RecetaPriceUpdatedListener],
  exports: [ProductosService],
})
export class ProductosModule {}

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RecetaUpdatedEvent } from 'src/modules/recetas/events/receta-updated.event';
import { ProductosService } from '../productos.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from '../entities/producto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecetaPriceUpdatedListener {
  constructor(
    private readonly productosService: ProductosService,
    @InjectRepository(Producto)
    private readonly productosRepo: Repository<Producto>,
  ) {}
  @OnEvent('receta.price.updated', { nextTick: true })
  async handleRecetaPriceUpdated(event: RecetaUpdatedEvent) {
    if (!event.receta_id || !event.nuevo_costo_unidad) return;

    const productosAffected = await this.productosService.findProductosByReceta(
      event.receta_id,
    );

    for (const producto of productosAffected) {
      this.productosService.calculateAndUpdatePrecioEstimado(
        producto,
        event.nuevo_costo_unidad,
      );

      await this.productosRepo.save(producto);
    }
  }
}

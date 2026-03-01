import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsumosService } from '../insumos.service';
import { InsumoUpdatedEvent } from '../events/update-insumo.event';
import { RecetasService } from 'src/modules/recetas/recetas.service';
import { Receta } from 'src/modules/recetas/entities/receta.entity';
import { RecetaUpdatedEvent } from 'src/modules/recetas/events/receta-updated.event';

@Injectable()
export class InsumoUpdatedListener {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(Receta)
    private readonly recetasRepo: Repository<Receta>,
    private readonly insumosService: InsumosService,
    private readonly recetasService: RecetasService,
  ) {}
  @OnEvent('insumo.price.updated')
  async handleInsumoPriceUpdatedEvent(event: InsumoUpdatedEvent) {
    if (!event.insumoId) return;

    const recetas = await this.insumosService.findRecetasWhoUseIt(
      event.insumoId,
    );
    for (const receta of recetas) {
      const costoAnterior = receta.costo_total;
      const costoUnidadAnterior = receta.costo_unidad;

      const updatedReceta = this.recetasService.updatePriceFor(receta);
      const savedReceta = await this.recetasRepo.save(updatedReceta);
      if (
        costoAnterior !== savedReceta.costo_total ||
        costoUnidadAnterior !== savedReceta.costo_unidad
      ) {
        const nextEvent = new RecetaUpdatedEvent();
        nextEvent.receta_id = savedReceta.id;
        this.eventEmitter.emit('receta.price.updated', nextEvent);
      }
    }
  }
}

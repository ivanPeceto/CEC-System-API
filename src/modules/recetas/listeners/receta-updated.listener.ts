import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { RecetaUpdatedEvent } from '../events/receta-updated.event';
import { Repository } from 'typeorm';
import { Receta } from '../entities/receta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RecetasService } from '../recetas.service';

@Injectable()
export class RecetaUpdatedListener {
  constructor(
    private readonly recetasService: RecetasService,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(Receta)
    private readonly recetasRepo: Repository<Receta>,
  ) {}
  @OnEvent('receta.price.updated')
  async handleRecetaPriceUpdatedEvent(event: RecetaUpdatedEvent) {
    if (event.receta_id) {
      const id = event.receta_id;
      const recetas = await this.recetasService.findRecetasWhoUseIt(id);
      for (const receta of recetas) {
        const costoAnterior = parseFloat(receta.costo_total);
        const updatedReceta = this.recetasService.updatePriceFor(receta);
        const savedReceta = await this.recetasRepo.save(updatedReceta);
        if (costoAnterior !== parseFloat(savedReceta.costo_total)) {
          const nextEvent = new RecetaUpdatedEvent();
          nextEvent.receta_id = savedReceta.id;
          this.eventEmitter.emit('receta.price.updated', nextEvent);
        }
      }
    }
  }
}

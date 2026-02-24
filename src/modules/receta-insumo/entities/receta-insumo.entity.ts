import { Insumo } from 'src/modules/insumos/entities/insumo.entity';
import { Receta } from 'src/modules/recetas/entities/receta.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('recetas_insumos')
export class RecetaInsumo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad: string;

  @ManyToOne(() => Receta, (receta) => receta.insumos)
  receta: Receta;

  @ManyToOne(() => Insumo, (insumo) => insumo.recetas)
  insumo: Insumo;

  @DeleteDateColumn()
  deletedAt: Date;
}

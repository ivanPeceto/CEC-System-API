import { Receta } from 'src/modules/recetas/entities/receta.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('recetas_subrecetas')
export class RecetaSubreceta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad: string;

  @ManyToOne(() => Receta, (receta) => receta.subrecetas, {
    onDelete: 'CASCADE',
  })
  receta: Receta;

  @ManyToOne(() => Receta, (subreceta) => subreceta.recetasQueLaUsan, {
    onDelete: 'CASCADE',
  })
  subreceta: Receta;

  @DeleteDateColumn()
  deletedAt: Date;
}

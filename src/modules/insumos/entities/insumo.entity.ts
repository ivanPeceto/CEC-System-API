import { RecetaInsumo } from 'src/modules/receta-insumo/entities/receta-insumo.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('insumos')
export class Insumo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, length: 200 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'varchar', length: 200 })
  unidad_medida: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  costo_unidad_medida: string;

  @OneToMany(() => RecetaInsumo, (recetaInsumo) => recetaInsumo.insumo)
  recetas: RecetaInsumo[];

  @DeleteDateColumn()
  deletedAt: Date;
}

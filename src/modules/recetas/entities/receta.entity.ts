import { Producto } from 'src/modules/productos/entities/producto.entity';
import { RecetaInsumo } from 'src/modules/receta-insumo/entities/receta-insumo.entity';
import { RecetaSubreceta } from 'src/modules/receta-subreceta/entities/receta-subreceta.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('recetas')
export class Receta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, unique: true })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  costo_total: string;

  @Column({ type: 'varchar', length: 200 })
  unidad_medida: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  unidades_por_receta: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  costo_unidad: string;

  @OneToMany(() => RecetaInsumo, (recetaInsumo) => recetaInsumo.receta, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  insumos: RecetaInsumo[];

  @OneToMany(() => RecetaSubreceta, (subreceta) => subreceta.receta, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  subrecetas: RecetaSubreceta[];

  @OneToMany(() => RecetaSubreceta, (recetaPadre) => recetaPadre.subreceta)
  recetasQueLaUsan: RecetaSubreceta[];

  @OneToMany(() => Producto, (producto) => producto.receta)
  productos: Producto[];

  @DeleteDateColumn()
  deletedAt: Date;
}

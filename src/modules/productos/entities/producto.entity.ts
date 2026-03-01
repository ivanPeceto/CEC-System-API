import { Categoria } from 'src/modules/categorias/entities/categoria.entity';
import { Receta } from 'src/modules/recetas/entities/receta.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @Column({ type: 'varchar', length: 200 })
  nombre_impresion: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  precio_unitario: string;

  @ManyToOne(() => Categoria, (categoria) => categoria.productos)
  categoria: Categoria;

  @ManyToOne(() => Receta, (receta) => receta.productos, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  receta?: Receta;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cantidad_receta: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  precio_estimado: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  margen_beneficio: string;

  @DeleteDateColumn()
  deletedAt: Date;
}

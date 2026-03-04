import { Producto } from 'src/modules/productos/entities/producto.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('reglas_precio')
export class ReglasPrecio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Producto, (producto) => producto.reglas_precio, {
    onDelete: 'CASCADE',
  })
  producto: Producto;

  @Column({ type: 'int' })
  cantidad_producto: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  precio_fijo: string;

  @DeleteDateColumn()
  deletedAt: Date;
}

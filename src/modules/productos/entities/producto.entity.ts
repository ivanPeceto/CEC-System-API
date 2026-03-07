import { Categoria } from 'src/modules/categorias/entities/categoria.entity';
import { PedidoProducto } from 'src/modules/pedido-producto/entities/pedido-producto.entity';
import { Receta } from 'src/modules/recetas/entities/receta.entity';
import { ReglasPrecio } from 'src/modules/reglas_precio/entities/reglas_precio.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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

  @OneToMany(() => ReglasPrecio, (reglaPrecio) => reglaPrecio.producto, {
    cascade: true,
    eager: true,
  })
  reglas_precio: ReglasPrecio[];

  @OneToMany(() => PedidoProducto, (ped_prod) => ped_prod.producto)
  pedidos_producto: PedidoProducto[];

  @DeleteDateColumn()
  deletedAt: Date;
}

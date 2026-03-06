import { Exclude } from 'class-transformer';
import { Pedido } from 'src/modules/pedidos/entities/pedido.entity';
import { Producto } from 'src/modules/productos/entities/producto.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('pedidos_productos')
export class PedidoProducto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude()
  @ManyToOne(() => Pedido, (pedido) => pedido.pedido_productos, {
    onDelete: 'CASCADE',
  })
  pedido: Pedido;

  @ManyToOne(() => Producto, (producto) => producto.pedidos_producto)
  producto: Producto;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cantidad_producto: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: string;

  @Column({ type: 'text', nullable: true })
  aclaraciones?: string;

  @DeleteDateColumn()
  deletedAt: Date;
}

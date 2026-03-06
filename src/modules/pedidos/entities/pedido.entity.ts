import { Cliente } from 'src/modules/clientes/entities/cliente.entity';
import { PedidoProducto } from 'src/modules/pedido-producto/entities/pedido-producto.entity';
import { Estados } from 'src/types/pedidos.types';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'datetime' })
  datetime: Date;

  @Column({ type: 'integer', default: 0 })
  numero?: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.pedidos)
  cliente: Cliente;

  @Column({ type: 'datetime', nullable: true })
  para_hora?: Date;

  @Column({ type: 'enum', enum: Estados, default: Estados.PENDIENTE })
  estado: Estados = Estados.PENDIENTE;

  @Column({ type: 'bool', default: false })
  pagado: boolean = false;

  @Column({ type: 'bool', default: false })
  avisado: boolean = false;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: string;

  @Column({ type: 'bool', default: false })
  es_venta_simple: boolean = false;

  @OneToMany(() => PedidoProducto, (ped_prod) => ped_prod.pedido, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  pedido_productos: PedidoProducto[];

  @DeleteDateColumn()
  deletedAt: Date;
}

import { Cliente } from 'src/modules/clientes/entities/cliente.entity';
import { Estados } from 'src/types/pedidos.types';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  datetime: Date;

  @Column({ type: 'integer', default: 0 })
  numero?: string;

  @ManyToOne(() => Cliente, (cliente) => cliente.pedidos)
  cliente: string;

  @Column({ type: 'time', nullable: true })
  para_hora?: Date;

  @Column({ type: 'enum', enum: Estados, default: Estados.PENDIENTE })
  estado: Estados = Estados.PENDIENTE;

  @Column({ type: 'bool', default: false })
  pagado: boolean = false;

  @Column({ type: 'bool', default: false })
  avisado: boolean = false;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: string;

  @Column({ type: 'bool', default: false })
  es_venta_simple: boolean = false;
}

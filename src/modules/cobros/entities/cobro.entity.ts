import { MetodosPago } from 'src/modules/metodos_pago/entities/metodos_pago.entity';
import { Pedido } from 'src/modules/pedidos/entities/pedido.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cobros')
export class Cobro {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'datetime' })
  datetime: Date;

  @ManyToOne(() => Pedido, (pedido) => pedido.cobros, {
    onDelete: 'CASCADE',
  })
  pedido: Pedido;

  @ManyToOne(() => MetodosPago, (metodo) => metodo.cobros, {
    onDelete: 'CASCADE',
  })
  metodo: MetodosPago;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  monto: string;

  @DeleteDateColumn()
  deletedAt: Date;
}

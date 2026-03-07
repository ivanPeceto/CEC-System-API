import { Pedido } from 'src/modules/pedidos/entities/pedido.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @Column({ type: 'varchar', nullable: true, length: 200 })
  telefono?: string;

  @Column({ type: 'varchar', nullable: true, length: 200 })
  direccion?: string;

  @OneToMany(() => Pedido, (pedido) => pedido.cliente)
  pedidos: Pedido[];

  @DeleteDateColumn()
  deletedAt: Date;
}

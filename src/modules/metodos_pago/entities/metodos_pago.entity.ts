import { Cobro } from 'src/modules/cobros/entities/cobro.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('metodos_pago')
export class MetodosPago {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, unique: true })
  nombre: string;

  @Column({ type: 'bool', default: false })
  facturable: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  recargo?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  descuento?: string;

  @OneToMany(() => Cobro, (cobro) => cobro.metodo)
  cobros: Cobro[];

  @DeleteDateColumn()
  deletedAt: Date;
}

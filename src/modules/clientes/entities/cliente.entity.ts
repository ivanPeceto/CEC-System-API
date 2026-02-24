import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @DeleteDateColumn()
  deletedAt: Date;
}

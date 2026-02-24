import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { hash } from 'bcrypt';
import { Roles } from 'src/types/users.types';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  username!: string;

  @Column({ type: 'varchar', length: 200 })
  email!: string;

  // Propiedad virtual solo para recibir el dato
  @Exclude()
  password?: string;

  @Column({ select: false })
  @Exclude()
  passwordHash: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.passwordHash = await hash(this.password, 10);
    }
  }

  @Column({ type: 'enum', enum: Roles, default: Roles.USUARIO })
  rol: Roles = Roles.USUARIO;

  @Column({ type: 'varchar', nullable: true, select: false })
  @Exclude()
  currentRefreshToken?: string | null;
}

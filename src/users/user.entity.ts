import { hash } from 'bcryptjs';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RolesEntity } from '../roles/role.entity';
@Entity('users')
@Unique(['email'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToMany(
    type => RolesEntity,
    roles => roles.users,
    { eager: true },
  )
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'roles_id' },
  })
  roles: RolesEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
